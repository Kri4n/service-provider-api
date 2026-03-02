const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");
const { generateToken } = require("../utils/jwt");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, mobileNumber, email, password, accountType } =
      req.body;

    // Check email uniqueness
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.createUser({
      firstName,
      lastName,
      mobileNumber,
      email,
      password: hashedPassword,
      accountType,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNumber: user.mobileNumber,
        email: user.email,
        accountType: user.accountType,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.getUserByEmail(email);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // verify password before issuing token
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT after successful authentication
    const token = generateToken({
      id: user.id,
      email: user.email,
      accountType: user.accountType,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllRegistrations = async (req, res, next) => {
  try {
    const users = await userRepository.getAllUsers();

    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        accountType: user.accountType,
        status: user.status,
      })),
    });
  } catch (err) {
    next(err);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const updatedUser = await userRepository.updateUserStatus(id, status);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: `User status updated to ${status} successfully`,
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

const getApprovedUsers = async (req, res, next) => {
  try {
    const users = await userRepository.getApprovedUsers();

    res.status(200).json({
      success: true,
      message: "Approved users fetched successfully",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

const filterByRole = async (req, res, next) => {
  try {
    const { role } = req.query;

    const users = await userRepository.filterByRole(role);

    res.status(200).json({
      success: true,
      message: `Approved users with role ${role} fetched successfully`,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getAllRegistrations,
  updateUserStatus,
  getApprovedUsers,
  filterByRole,
};
