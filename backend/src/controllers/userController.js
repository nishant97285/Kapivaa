import pool from "../config/db.js";

export const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, dob, gender, coins, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found." });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, dob, gender } = req.body;
    await pool.query(
      "UPDATE users SET name = ?, phone = ?, dob = ?, gender = ? WHERE id = ?",
      [name, phone, dob, gender, req.user.id]
    );
    res.json({ message: "Profile updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getCoins = async (req, res) => {
  try {
    const [user] = await pool.query("SELECT coins FROM users WHERE id = ?", [req.user.id]);
    const [history] = await pool.query(
      "SELECT * FROM coin_transactions WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ coins: user[0].coins, history });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM addresses WHERE user_id = ?", [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { label, name, phone, line1, city, state, pincode } = req.body;
    await pool.query(
      "INSERT INTO addresses (user_id, label, name, phone, line1, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [req.user.id, label, name, phone, line1, city, state, pincode]
    );
    res.status(201).json({ message: "Address added successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    await pool.query("DELETE FROM addresses WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
    res.json({ message: "Address deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    await pool.query("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [req.user.id]);
    await pool.query("UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
    res.json({ message: "Default address updated." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM wishlist WHERE user_id = ? ORDER BY added_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { product_name, price, original_price, discount, image_url, rating, reviews } = req.body;
    await pool.query(
      "INSERT INTO wishlist (user_id, product_name, price, original_price, discount, image_url, rating, reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [req.user.id, product_name, price, original_price, discount, image_url, rating, reviews]
    );
    res.status(201).json({ message: "Added to wishlist." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    await pool.query("DELETE FROM wishlist WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
    res.json({ message: "Removed from wishlist." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};