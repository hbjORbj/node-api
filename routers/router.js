const express = require("express");
const {
  createPostValidator,
  signUpValidator,
  requireLogin,
  isAuthorized,
} = require("../middlewares");
const { getHome, createPost } = require("../controllers/globalController");
const {
  login,
  logout,
  signUp,
  userById,
} = require("../controllers/userController");
const router = express.Router();

// GET method
router.get("/", getHome);
router.get("/logout", logout);

// POST method
router.post("/login", login);
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
