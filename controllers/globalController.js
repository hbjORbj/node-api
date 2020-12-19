const Post = require("../models/Post");
const User = require("../models/User");

exports.getHome = (req, res) => {
  const posts = Post.find()
    .select("_id title body")
    .then((posts) => {
      res.json({ posts: posts });
    })
    .catch((error) => console.log(error));
};

exports.createPost = (req, res) => {
  const post = new Post(req.body);
  post.save().then((result) => {
    res.json({
      post: result,
    });
  });
};

exports.getAllUsers = (req, res) => {
  User.find((error, users) => {
    if (error) {
      return res.status(400).json({
        error,
      });
    } else {
      res.json({ users: users });
    }
  }).select("name email created updated");
};
