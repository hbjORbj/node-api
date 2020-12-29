const Post = require("../models/Post");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

/* 
**
Find post by id
and add a post object (filled with post info) to req
**
*/
exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .populate("likes", "_id name")
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
    .exec((err, posts) => {
      if (err) {
        res.status(400).json({ error: "Posts could not be loaded." });
      } else {
        res.json(posts);
      }
    });
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
      let user = req.profile;
      user.hashedPassword = undefined;
      user.salt = undefined;
      post.postedBy = user;
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
exports.updatePost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({ error: "Image could not be uploaded." });
    } else {
      let post = req.post;
      post = _.extend(post, fields);
      post.updated = Date.now();

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

/* 
**
Get a post
**
*/
exports.getPost = (req, res) => {
  return res.json(req.post);
};

/* 
**
Get a post's photo
**
*/
exports.getPostPhoto = (req, res) => {
  if (req.post.photo && req.post.photo.data) {
    res.set(("Content-Type", req.post.photo.contentType));
    return res.send(req.post.photo.data);
  } else {
    return res.send("No photo");
  }
};

/* 
**
Like a post
**
*/
exports.likePost = async (req, res) => {
  const { userId, postId } = req.body;
  await Post.findByIdAndUpdate(
    {
      _id: postId,
    },
    {
      $push: { likes: userId },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) return res.status(400).json({ error: err });
    else {
      return res.json(result);
    }
  });
};

/* 
**
Unlike a post
**
*/
exports.unlikePost = async (req, res) => {
  const { userId, postId } = req.body;
  await Post.findByIdAndUpdate(
    {
      _id: postId,
    },
    {
      $pull: { likes: userId },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) return res.status(400).json({ error: err });
    else {
      return res.json(result);
    }
  });
};

/* 
**
Post comment
**
*/
exports.postComment = async (req, res) => {
  const { userId, postId, comment } = req.body;
  comment.postedBy = userId;
  await Post.findByIdAndUpdate(
    { _id: postId },
    {
      $push: { comments: comment },
    },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) return res.status(400).json({ error: err });
      else {
        return res.json(result);
      }
    });
};

/* 
**
Delete comment
**
*/
exports.deleteComment = async (req, res) => {
  const { userId, postId, comment } = req.body;
  comment.postedBy = userId;
  await Post.findByIdAndUpdate(
    { _id: postId },
    {
      $pull: { comments: { _id: comment._id } },
    },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) return res.status(400).json({ error: err });
      else {
        return res.json(result);
      }
    });
};

// /*
// **
// Update comment
// **
// */
// exports.updateComment = (req, res) => {
//   const { userId, postId, comment } = req.body;
//   comment.postedBy = userId;
//   Post.findByIdAndUpdate(
//     { _id: postId },
//     {
//       $pull: { comments: { _id: comment._id } },
//     }
//   ).exec((err, result) => {
//     if (err) return res.status(400).json({ error: err });
//     else {
//       Post.findByIdAndUpdate(
//         { _id: postId },
//         {
//           $push: { comments: comment, updated: new Date() },
//         },
//         { new: true }
//       )
//         .populate("comments.postedBy", "_id name")
//         .populate("postedBy", "_id name")
//         .exec((err, result) => {
//           if (err) return res.status(400).json({ error: err });
//           else return res.json(result);
//         });
//     }
//   });
// };
