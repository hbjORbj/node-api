const express = require("express");
const {
  getAllUsers,
  getUser,
  userById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { requireLogin, isAuthorized } = require("../middlewares");
const userRouter = express.Router();

// GET method
userRouter.get("/users", getAllUsers);
userRouter.get("/user/:userId", requireLogin, getUser);

// POST method

// PUT method
userRouter.put("/user/:userId", requireLogin, isAuthorized, updateUser);

// DELETE method
userRouter.delete("/user/:userId", requireLogin, isAuthorized, deleteUser);

// For any route containing "userId", we execute userById() method
userRouter.param("userId", userById);

module.exports = userRouter;
