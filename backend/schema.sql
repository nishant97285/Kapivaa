-- CREATE DATABASE kapiva;
-- show databases;
-- USE kapiva;
show databases;
USE kapiva;
USE kapiva;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  dob DATE,
  gender ENUM('Male', 'Female', 'Other'),
  coins INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  qty INT DEFAULT 1,
  status ENUM('Pending', 'In Transit', 'Delivered', 'Cancelled') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  label VARCHAR(50) DEFAULT 'Home',
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15),
  line1 VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  pincode VARCHAR(10) NOT NULL,
  is_default TINYINT(1) DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2),
  original_price DECIMAL(10, 2),
  discount INT,
  image_url VARCHAR(500),
  rating DECIMAL(2, 1),
  reviews INT,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Coin transactions table
CREATE TABLE IF NOT EXISTS coin_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  label VARCHAR(255),
  coins INT NOT NULL,
  type ENUM('earned', 'used') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- In Users table  referral columns add 
ALTER TABLE users 
ADD COLUMN referral_code VARCHAR(20) UNIQUE,
ADD COLUMN referred_by VARCHAR(20) DEFAULT NULL;

--  admin/seed user insert manually
INSERT INTO users (name, email, password, coins, referral_code)
VALUES ('Admin', 'admin@kapiva.com', '112233', 0, 'KAPIVA2026');
DESC users;

USE kapiva;
SELECT * FROM users;

USE kapiva;

INSERT INTO users (name, email, password, coins, referral_code, referred_by)
VALUES ('Admin', 'admin@kapiva.com', 'admin123', 0, 'KAPIVA2026', NULL);

SELECT id, name, email, referral_code FROM users;


USE kapiva;

-- Wallet table
CREATE TABLE IF NOT EXISTS wallet (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  balance DECIMAL(10,2) DEFAULT 0.00,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Wallet transactions history
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  admin_id INT NOT NULL,
  type ENUM('credit', 'debit') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  note VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Admin table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add role column to users
ALTER TABLE users ADD COLUMN role ENUM('user','admin') DEFAULT 'user';

-- Fix referral_code to be US+ID based (update existing)
ALTER TABLE users ADD COLUMN user_code VARCHAR(20);