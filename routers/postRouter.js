const express = require("express");
const {
  createPost,
  getAllPosts,
  getPostsByUser,
  postById,
  deletePost,
  updatePost,
  getPost,
  getPostPhoto,
  likePost,
  unlikePost,
  postComment,
  deleteComment,
} = require("../controllers/postController");
const { userById } = require("../controllers/userController");
const {
  requireLogin,
  isAccountOwner,
  isPostOwner,
  createPostValidator,
} = require("../middlewares");
const postRouter = express.Router();

postRouter.get("/posts", getAllPosts);
postRouter.put("/post/like", requireLogin, likePost);
postRouter.put("/post/unlike", requireLogin, unlikePost);
postRouter.put("/post/comment", requireLogin, postComment);
postRouter.put("/post/uncomment", requireLogin, deleteComment);

// :userId
postRouter.get("/posts/by/:userId", requireLogin, getPostsByUser);
postRouter.post(
  "/post/new/:userId",
  requireLogin,
  isAccountOwner,
  createPost,
  createPostValidator
);

// :postId
postRouter.get("/post/:postId", getPost);
postRouter.put("/post/:postId", requireLogin, isPostOwner, updatePost);
postRouter.delete("/post/:postId", requireLogin, isPostOwner, deletePost);
postRouter.get("/post/photo/:postId", getPostPhoto);

// For any route containing "userId", we execute userById() method
postRouter.param("userId", userById);

// For any route containing "postId", we execute postById() method
postRouter.param("postId", postById);

module.exports = postRouter;
