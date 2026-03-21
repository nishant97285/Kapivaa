import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

// ── ADMIN LOGIN ──
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [admins] = await pool.query("SELECT * FROM admins WHERE email = ?", [email]);
    if (admins.length === 0)
      return res.status(401).json({ message: "Invalid credentials." });

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Admin login successful!", token, admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET ALL USERS (with search + pagination) ──
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    const searchQuery = `%${search}%`;

    const [users] = await pool.query(
      `SELECT id, name, email, phone, coins, referral_code, referred_by, role, created_at
       FROM users
       WHERE name LIKE ? OR email LIKE ? OR referral_code LIKE ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [searchQuery, searchQuery, searchQuery, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM users WHERE name LIKE ? OR email LIKE ? OR referral_code LIKE ?`,
      [searchQuery, searchQuery, searchQuery]
    );

    res.json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET SINGLE USER ──
export const getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, coins, referral_code, referred_by, role, created_at FROM users WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found." });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── IMPERSONATE USER (admin login as user) ──
export const impersonateUser = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found." });

    const user = rows[0];

    // Generate user token with impersonation flag
    const token = jwt.sign(
      { id: user.id, email: user.email, impersonated: true, adminId: req.admin.id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: `Logged in as ${user.name}`,
      token,
      user: { id: user.id, name: user.name, email: user.email, coins: user.coins, referral_code: user.referral_code },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET USER TEAM (multi-level) ──
export const getUserTeam = async (req, res) => {
  try {
    const userId = req.params.id;

    // Get the user's referral code first
    const [[user]] = await pool.query(
      "SELECT referral_code FROM users WHERE id = ?",
      [userId]
    );
    if (!user) return res.status(404).json({ message: "User not found." });

    // Recursive team fetch - level by level
    const buildTeam = async (referralCode, level = 1, maxLevel = 5) => {
      if (level > maxLevel) return [];

      const [members] = await pool.query(
        "SELECT id, name, email, referral_code, coins, created_at FROM users WHERE referred_by = ?",
        [referralCode]
      );

      // For each member, recursively get their team
      const membersWithTeam = await Promise.all(
        members.map(async (member) => ({
          ...member,
          level,
          team: await buildTeam(member.referral_code, level + 1, maxLevel),
        }))
      );

      return membersWithTeam;
    };

    const team = await buildTeam(user.referral_code);

    // Count total members across all levels
    const countMembers = (arr) => arr.reduce((acc, m) => acc + 1 + countMembers(m.team), 0);

    res.json({
      total_members: countMembers(team),
      team,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET WALLET BALANCE ──
export const getWallet = async (req, res) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get or create wallet
    let [wallet] = await pool.query("SELECT * FROM wallet WHERE user_id = ?", [userId]);
    if (wallet.length === 0) {
      await pool.query("INSERT INTO wallet (user_id, balance) VALUES (?, 0)", [userId]);
      [wallet] = await pool.query("SELECT * FROM wallet WHERE user_id = ?", [userId]);
    }

    const [transactions] = await pool.query(
      "SELECT wt.*, a.name as admin_name FROM wallet_transactions wt LEFT JOIN admins a ON wt.admin_id = a.id WHERE wt.user_id = ? ORDER BY wt.created_at DESC LIMIT ? OFFSET ?",
      [userId, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) as total FROM wallet_transactions WHERE user_id = ?",
      [userId]
    );

    res.json({
      balance: wallet[0].balance,
      transactions,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── ADD / SUBTRACT WALLET AMOUNT ──
export const updateWallet = async (req, res) => {
  try {
    const { user_id, type, amount, note } = req.body;

    if (!user_id || !type || !amount)
      return res.status(400).json({ message: "user_id, type and amount required." });

    if (!["credit", "debit"].includes(type))
      return res.status(400).json({ message: "Type must be credit or debit." });

    if (amount <= 0)
      return res.status(400).json({ message: "Amount must be greater than 0." });

    // Get or create wallet
    let [wallet] = await pool.query("SELECT * FROM wallet WHERE user_id = ?", [user_id]);
    if (wallet.length === 0) {
      await pool.query("INSERT INTO wallet (user_id, balance) VALUES (?, 0)", [user_id]);
      [wallet] = await pool.query("SELECT * FROM wallet WHERE user_id = ?", [user_id]);
    }

    const currentBalance = parseFloat(wallet[0].balance);

    // Check sufficient balance for debit
    if (type === "debit" && currentBalance < amount)
      return res.status(400).json({ message: "Insufficient wallet balance." });

    const newBalance = type === "credit"
      ? currentBalance + parseFloat(amount)
      : currentBalance - parseFloat(amount);

    // Update wallet balance
    await pool.query("UPDATE wallet SET balance = ? WHERE user_id = ?", [newBalance, user_id]);

    // Save transaction history
    await pool.query(
      "INSERT INTO wallet_transactions (user_id, admin_id, type, amount, note) VALUES (?, ?, ?, ?, ?)",
      [user_id, req.admin.id, type, amount, note || null]
    );

    res.json({ message: `Wallet ${type}ed successfully!`, new_balance: newBalance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};