const express = require("express");
const { createPost, getAllPosts } = require("../controllers/postController");
const { userById } = require("../controllers/userController");
const {
  requireLogin,
  isAuthorized,
  createPostValidator,
} = require("../middlewares");
const postRouter = express.Router();
// GET method
postRouter.get("/", getAllPosts);

// POST method
postRouter.post(
  "/post/new/:userId",
  requireLogin,
  isAuthorized,
  createPost,
  createPostValidator
);

// For any route containing "userId", we execute userById() method
postRouter.param("userId", userById);

module.exports = postRouter;
