import pool from "../config/db.js";
import bcrypt from "bcryptjs";

// ── BALANCE ──────────────────────────────────────────────────────────────────

export const getBalance = async (req, res) => {
  try {
    // Get wallet balance
    let [wallet] = await pool.query(
      "SELECT balance FROM wallet WHERE user_id = ?",
      [req.user.id]
    );

    // Create wallet if not exists
    if (wallet.length === 0) {
      await pool.query("INSERT INTO wallet (user_id, balance) VALUES (?, 0)", [req.user.id]);
      wallet = [{ balance: 0 }];
    }

    // Get total withdrawn
    const [[withdrawn]] = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM withdrawals WHERE user_id = ? AND status = 'Paid'",
      [req.user.id]
    );

    res.json({
      wallet_balance: wallet[0].balance,
      total_withdrawn: withdrawn.total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── TEAM ─────────────────────────────────────────────────────────────────────

// Direct team — level 1 only (users who used my referral code)
export const getDirectTeam = async (req, res) => {
  try {
    // Get logged in user's referral code
    const [[user]] = await pool.query(
      "SELECT referral_code FROM users WHERE id = ?",
      [req.user.id]
    );

    const [members] = await pool.query(
      `SELECT id, name, email, referral_code, coins, created_at
       FROM users
       WHERE referred_by = ?
       ORDER BY created_at DESC`,
      [user.referral_code]
    );

    res.json({ total: members.length, members });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// All team — multi-level recursive
export const getAllTeam = async (req, res) => {
  try {
    const [[user]] = await pool.query(
      "SELECT referral_code FROM users WHERE id = ?",
      [req.user.id]
    );

    // Recursive fetch — level by level up to 10 levels
    const buildTeam = async (referralCode, level = 1, maxLevel = 10) => {
      if (level > maxLevel) return [];

      const [members] = await pool.query(
        "SELECT id, name, email, referral_code, coins, created_at FROM users WHERE referred_by = ?",
        [referralCode]
      );

      const membersWithTeam = await Promise.all(
        members.map(async (member) => ({
          ...member,
          level,
          sub_team: await buildTeam(member.referral_code, level + 1, maxLevel),
        }))
      );

      return membersWithTeam;
    };

    const team = await buildTeam(user.referral_code);

    // Flatten for table view
    const flatten = (arr) =>
      arr.reduce((acc, m) => {
        const { sub_team, ...rest } = m;
        return [...acc, rest, ...flatten(sub_team)];
      }, []);

    const flatTeam = flatten(team);

    res.json({ total: flatTeam.length, members: flatTeam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── ACTIVATION ───────────────────────────────────────────────────────────────

export const activateId = async (req, res) => {
  try {
    const { member_id, package_name, transaction_id } = req.body;

    if (!member_id || !package_name || !transaction_id)
      return res.status(400).json({ message: "All fields are required." });

    // Package amount mapping
    const packageAmounts = {
      "Basic":    999,
      "Silver":   2999,
      "Gold":     5999,
      "Platinum": 9999,
    };

    const amount = packageAmounts[package_name];
    if (!amount)
      return res.status(400).json({ message: "Invalid package selected." });

    // Check if member exists
    const [member] = await pool.query(
      "SELECT id FROM users WHERE referral_code = ?",
      [member_id]
    );
    if (member.length === 0)
      return res.status(404).json({ message: "Member ID not found." });

    await pool.query(
      "INSERT INTO activations (user_id, package_name, amount, transaction_id, status) VALUES (?, ?, ?, ?, ?)",
      [member[0].id, package_name, amount, transaction_id, "Active"]
    );

    res.status(201).json({ message: "ID activated successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getActivationHistory = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, u.name as member_name, u.referral_code
       FROM activations a
       JOIN users u ON a.user_id = u.id
       WHERE a.user_id IN (
         SELECT id FROM users WHERE referred_by = (
           SELECT referral_code FROM users WHERE id = ?
         )
       )
       OR a.user_id = ?
       ORDER BY a.created_at DESC`,
      [req.user.id, req.user.id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── INCOME ───────────────────────────────────────────────────────────────────

export const getAllIncome = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM income WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReferralIncome = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM income WHERE user_id = ? AND type = 'Referral Income' ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── WITHDRAWAL ───────────────────────────────────────────────────────────────

export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, method, account_number, ifsc_code, upi_id } = req.body;

    if (!amount || !method)
      return res.status(400).json({ message: "Amount and method are required." });

    if (amount < 500)
      return res.status(400).json({ message: "Minimum withdrawal amount is ₹500." });

    // Check wallet balance
    const [wallet] = await pool.query(
      "SELECT balance FROM wallet WHERE user_id = ?",
      [req.user.id]
    );

    const balance = wallet.length > 0 ? parseFloat(wallet[0].balance) : 0;
    if (balance < amount)
      return res.status(400).json({ message: "Insufficient wallet balance." });

    // Deduct from wallet
    await pool.query(
      "UPDATE wallet SET balance = balance - ? WHERE user_id = ?",
      [amount, req.user.id]
    );

    // Create withdrawal request
    await pool.query(
      "INSERT INTO withdrawals (user_id, amount, method, account_number, ifsc_code, upi_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [req.user.id, amount, method, account_number || null, ifsc_code || null, upi_id || null, "Pending"]
    );

    res.status(201).json({ message: "Withdrawal request submitted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWithdrawalHistory = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM withdrawals WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── SUPPORT ──────────────────────────────────────────────────────────────────

export const submitTicket = async (req, res) => {
  try {
    const { subject, category, message } = req.body;

    if (!subject || !message)
      return res.status(400).json({ message: "Subject and message are required." });

    await pool.query(
      "INSERT INTO support_tickets (user_id, subject, category, message, status) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, subject, category || "Other", message, "Open"]
    );

    res.status(201).json({ message: "Support ticket submitted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── CHANGE PASSWORD ──────────────────────────────────────────────────────────

export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password)
      return res.status(400).json({ message: "Both fields are required." });

    if (new_password.length < 6)
      return res.status(400).json({ message: "New password must be at least 6 characters." });

    // Get current password hash
    const [[user]] = await pool.query(
      "SELECT password FROM users WHERE id = ?",
      [req.user.id]
    );

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Current password is incorrect." });

    const hashedNew = await bcrypt.hash(new_password, 12);
    await pool.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedNew, req.user.id]
    );

    res.json({ message: "Password changed successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};