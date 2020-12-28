const express = require("express");
const {
  getAllUsers,
  getUser,
  userById,
  updateUser,
  deleteUser,
  getUserPhoto,
  followUser,
  unfollowUser,
  findPeople,
} = require("../controllers/userController");
const { requireLogin, isAccountOwner } = require("../middlewares");
const userRouter = express.Router();

userRouter.get("/users", getAllUsers);
userRouter.put("/user/follow", requireLogin, followUser);
userRouter.put("/user/unfollow", requireLogin, unfollowUser);

// :userId
userRouter.get("/user/:userId", requireLogin, getUser);
userRouter.put("/user/:userId", requireLogin, isAccountOwner, updateUser);
userRouter.delete("/user/:userId", requireLogin, isAccountOwner, deleteUser);
userRouter.get("/user/findpeople/:userId", requireLogin, findPeople);
userRouter.get("/user/photo/:userId", getUserPhoto);

// For any route containing "userId", we execute userById() method
userRouter.param("userId", userById);

module.exports = userRouter;
