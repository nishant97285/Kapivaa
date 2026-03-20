export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || name.trim().length < 2)
    return res.status(400).json({ message: "Naam kam se kam 2 characters ka hona chahiye." });

  if (!email || !emailRegex.test(email))
    return res.status(400).json({ message: "Valid email address daalo." });

  if (!password || password.length < 6)
    return res.status(400).json({ message: "Password kam se kam 6 characters ka hona chahiye." });

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email aur password required hain." });
  next();
};