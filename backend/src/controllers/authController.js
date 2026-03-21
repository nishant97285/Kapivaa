import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import generateReferralCode from "../utils/generateReferralCode.js";
import dotenv from "dotenv";
dotenv.config();

// ── REGISTER ──
export const register = async (req, res) => {
  try {
    const { username, email, password, referral_code } = req.body;

    // Email already exists check
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0)
      return res.status(409).json({ message: "Email already registered." });

   // Referral code valid hai ya nahi — direct check
   const [referrer] = await pool.query(
  "SELECT id FROM users WHERE referral_code = ?",
  [referral_code.trim()]
  );
  if (referrer.length === 0)
   return res.status(400).json({ message: "Invalid referral code." });

  const referredBy = referral_code.trim();

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 12);

    // Unique referral code generate karo is user ke liye
    let newReferralCode;
    let isUnique = false;
    while (!isUnique) {
      newReferralCode = generateReferralCode(username);
      const [check] = await pool.query(
        "SELECT id FROM users WHERE referral_code = ?",
        [newReferralCode]
      );
      if (check.length === 0) isUnique = true;
    }

    // User insert
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, coins, referral_code, referred_by) VALUES (?, ?, ?, ?, ?, ?)",
      [username, email, hashedPassword, 0, newReferralCode, referredBy]
    );

    // Agar referral code use kiya toh referrer ko 50 coins bonus
    if (referredBy) {
      await pool.query(
        "UPDATE users SET coins = coins + 50 WHERE referral_code = ?",
        [referredBy]
      );
      await pool.query(
        "INSERT INTO coin_transactions (user_id, label, coins, type) SELECT id, 'Referral Bonus', 50, 'earned' FROM users WHERE referral_code = ?",
        [referredBy]
      );

      // Naye user ko bhi 20 coins welcome bonus
      await pool.query(
        "UPDATE users SET coins = coins + 20 WHERE id = ?",
        [result.insertId]
      );
      await pool.query(
        "INSERT INTO coin_transactions (user_id, label, coins, type) VALUES (?, ?, ?, ?)",
        [result.insertId, "Welcome Referral Bonus", 20, "earned"]
      );
    }

    // JWT
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: "Registration successful!",
      token,
      referral_code: newReferralCode,
      user: {
        id: result.insertId,
        name: username,
        email,
        coins: referredBy ? 20 : 0,
        referral_code: newReferralCode,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// ── LOGIN ──
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (users.length === 0)
      return res.status(401).json({ message: "Invalid email or password." });

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password." });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        coins: user.coins,
        referral_code: user.referral_code,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
};