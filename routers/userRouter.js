const express = require("express");
const {
  getAllUsers,
  getUser,
  userById,
  updateUser,
  deleteUser,
  getUserPhoto,
} = require("../controllers/userController");
const { requireLogin, isAccountOwner } = require("../middlewares");
const userRouter = express.Router();

// GET method
userRouter.get("/users", getAllUsers);
userRouter.get("/user/:userId", requireLogin, getUser);
userRouter.get("/user/photo/:userId", getUserPhoto);

// POST method

// PUT method
userRouter.put("/user/:userId", requireLogin, isAccountOwner, updateUser);

// DELETE method
userRouter.delete("/user/:userId", requireLogin, isAccountOwner, deleteUser);

// For any route containing "userId", we execute userById() method
userRouter.param("userId", userById);

module.exports = userRouter;
