const express = require("express");
const { createPost } = require("../controllers/postController");
const { requireLogin, isAuthorized, createPostValidator } = require("../middlewares");
const postRouter = express.Router();
// GET method

// POST method
postRouter.post(
  "/post",
  requireLogin,
  isAuthorized,
  createPostValidator,
  createPost
);

module.exports = postRouter;
