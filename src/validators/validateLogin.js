const userRepository = require("../repositories/userRepository");

const validateLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  try {
    // Fetch the user
    const user = await userRepository.getUserByEmail(email);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Check if user status is approved or pending
    if (user.status == "pending") {
      return res.status(403).json({
        success: false,
        message: "Your account is not approved yet. Please wait for approval.",
      });
    }

    // Check if user status is rejected
    if (user.status == "rejected") {
      return res.status(403).json({
        success: false,
        message: "Your account has been rejected.",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = validateLogin;
