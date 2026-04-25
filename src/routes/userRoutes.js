const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validateRegister = require("../validators/validateRegister");
const validateLogin = require("../validators/validateLogin");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorizeRole");

// Public: register/login
router.post("/register", validateRegister, userController.register);
router.post("/login", validateLogin, userController.login);

router.get("/all-users", userController.getAllUsers);
router.get("/count", userController.countAllUsers);

// Admin only
router.get(
  "/all-registrations",
  authenticate,
  authorize("admin"),
  userController.getAllRegistrations,
);
router.put(
  "/update-status/:id",
  authenticate,
  authorize("admin"),
  userController.updateUserStatus,
);

// Customer only
router.get(
  "/approved-users",
  authenticate,
  authorize("customer"),
  userController.getApprovedUsers,
);
router.get(
  "/filter/role",
  authenticate,
  authorize("customer"),
  userController.filterByRole,
);

module.exports = router;
