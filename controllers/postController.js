const Post = require("../models/Post");

/* 
**
Create a post
**
*/

exports.createPost = (req, res) => {
  const post = new Post(req.body);
  post.save().then((result) => {
    res.json({
      post: result,
    });
  });
};
