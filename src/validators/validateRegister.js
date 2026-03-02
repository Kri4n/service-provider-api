module.exports = (req, res, next) => {
  const { firstName, lastName, mobileNumber, email, password, accountType } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !mobileNumber ||
    !email ||
    !password ||
    !accountType
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // Mobile number format (digits only)
  const mobileRegex = /^[0-9]{10,15}$/;
  if (!mobileRegex.test(mobileNumber)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid mobile number format" });
  }

  // Role validation
  if (!["admin", "provider", "customer"].includes(accountType)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid role selected" });
  }

  next();
};
