const Post = require("../models/Post");
const formidable = require("formidable");
const fs = require("fs");

/* 
**
Find post by id
and add a post object (filled with post info) to req
**
*/
exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name") // getting post owner's information
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          error: "Post not found",
        });
      } else {
        req.post = post;
        next();
      }
    });
};

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

/* 
**
Update a post
**
*/
exports.updatePost = async (req, res) => {
  const { _id } = req.post;
  const { title, body } = req.body;
  await Post.updateOne({ _id }, { title, body, updated: Date.now() }, (err) => {
    if (err) {
      res.status(400).json({ error: "Post could not be updated." });
    } else {
      res.json({ message: "Post has been updated successfully." });
    }
  });
};

/* 
**
Delete a post
**
*/
exports.deletePost = async (req, res) => {
  const { _id } = req.post;
  await Post.deleteOne({ _id }, (err) => {
    if (err) {
      res.status(400).json({ error: "Post could not be deleted." });
    } else {
      res.json({ message: "Post has been deleted successfully." });
    }
  });
};
