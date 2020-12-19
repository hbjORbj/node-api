const Post = require("../models/Post");
const formidable = require("formidable");
const fs = require("fs");

/* 
**
Get Posts
**
*/
exports.getAllPosts = async (req, res) => {
  await Post.find()
    .populate("postedBy", "_id name") // getting post owner's information
    .select("_id title body created")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((error) =>
      res.status(400).json({ error: "Posts could not be loaded." })
    );
};

/* 
**
Get all posts by user
**
*/
exports.getPostsByUser = async (req, res) => {
  const { _id } = req.profile;
  await Post.find({ postedBy: _id })
    .populate("postedBy", "_id name") // getting post owner's information
    .select("_id title body created")
    .sort({ created: -1 })
    .exec((err, posts) => {
      if (err) {
        res.status(200).json({ error: "Posts could not be loaded." });
      } else {
        res.json(posts);
      }
    });
};

/* 
**
Create a post
**
*/

exports.createPost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({ error: "Image could not be uploaded." });
    } else {
      let post = new Post(fields);
      req.profile.hashedPassword = undefined;
      req.profile.salt = undefined;
      post.postedBy = req.profile;
      if (files.photo) {
        post.photo.data = fs.readFileSync(files.photo.path);
        post.photo.contentType = files.photo.type;
      }
      post.save((err, result) => {
        if (err) {
          res.status(400).json({ error: err });
        } else {
          res.json(result);
        }
      });
    }
  });
};
