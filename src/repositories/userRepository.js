const { User } = require("../models");

const createUser = async (data) => {
  return await User.create(data);
};

const getUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const getAllUsers = async () => {
  return await User.findAll();
};

const countAllUsers = async () => {
  return await User.count();
};

const updateUserStatus = async (id, status) => {
  await User.update({ status }, { where: { id } });
  return await User.findByPk(id);
};

const getApprovedUsers = async () => {
  return await User.findAll({
    where: { status: "approved" },
    order: [["createdAt", "DESC"]],
  });
};

const filterByRole = async (role) => {
  return await User.findAll({
    where: { accountType: role },
    order: [["createdAt", "DESC"]],
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  getAllUsers,
  updateUserStatus,
  getApprovedUsers,
  countAllUsers,
  filterByRole,
};
