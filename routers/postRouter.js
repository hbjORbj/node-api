const express = require("express");
const {
  createPost,
  getAllPosts,
  getPostsByUser,
  postById,
  deletePost,
  updatePost,
} = require("../controllers/postController");
const { userById } = require("../controllers/userController");
const {
  requireLogin,
  isAccountOwner,
  isPostOwner,
  createPostValidator,
} = require("../middlewares");
const postRouter = express.Router();

// GET method
postRouter.get("/posts", getAllPosts);
postRouter.get("/posts/by/:userId", requireLogin, getPostsByUser);

// POST method
postRouter.post(
  "/post/new/:userId",
  requireLogin,
  isAccountOwner,
  createPost,
  createPostValidator
);

// PUT method
postRouter.put("/post/:postId", requireLogin, isPostOwner, updatePost);

// DELETE method
postRouter.delete("/post/:postId", requireLogin, isPostOwner, deletePost);

// For any route containing "userId", we execute userById() method
postRouter.param("userId", userById);

// For any route containing "postId", we execute postById() method
postRouter.param("postId", postById);

module.exports = postRouter;
