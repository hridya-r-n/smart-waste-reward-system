const User = require("../models/user");
const bcrypt = require("bcryptjs");

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      role: "user"
    });

    await user.save();

    res.json({ message: "User registered" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    res.json({
      id: user._id,
      name: user.name,
      role: user.role,
      points: user.points
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};