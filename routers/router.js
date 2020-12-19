const express = require("express");
const {
  createPostValidator,
  signUpValidator,
  loginValidator,
  requireLogin,
  isAuthorized,
} = require("../middlewares");
const {
  getHome,
  login,
  logout,
  signUp,
} = require("../controllers/globalController");
const {
  userById,
  getAllUsers,
  getUser,
} = require("../controllers/userController");
const { createPost } = require("../controllers/postController");
const router = express.Router();

// GET method
router.get("/", getHome);
router.get("/logout", logout);
router.get("/users", getAllUsers);
router.get("/user/:userId", requireLogin, getUser);

// POST method
router.post("/login", loginValidator, login);
router.post("/signup", signUpValidator, signUp);
router.post(
  "/post",
  requireLogin,
  isAuthorized,
  createPostValidator,
  createPost
);

// For any route containing "userId", we execute userById() method
router.param("userId", userById);

module.exports = router;
