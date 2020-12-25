const User = require("../models/User");

/* 
**
Find user by id
and add a profile object (filled with user info) to req
**
*/
exports.userById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    } else {
      req.profile = user;
      next();
    }
  });
};

/* 
**
Get all users
**
*/
exports.getAllUsers = (req, res) => {
  User.find((error, users) => {
    if (error) {
      return res.status(400).json({
        error,
      });
    } else {
      res.json(users);
    }
  }).select("_id name email created updated");
};

/* 
**
Get a single user
**
*/
exports.getUser = (req, res) => {
  const { _id, name, email, created, updated } = req.profile;
  return res.json({ _id, name, email, created, updated });
};

// /*
// **
// Get user's photo
// **
// */
// exports.getUserPhoto = (req, res, next) => {
//   const { photo } = req.profile;
//   if (photo.data) {
//     res.set(("Content-Type", photo.contentType));
//     return res.send(photo.data);
//   }
//   next();
// };

/*
**
Update a user
**
*/
exports.updateUser = async (req, res) => {
  const { _id, name, email } = req.body;
  await User.findOneAndUpdate({ _id }, { name, email, updated: Date.now() });
  const { created, updated } = User.findById(_id);
  return res.json({ _id, name, email, created, updated });
};

/*
**
Delete a user
**
*/
exports.deleteUser = async (req, res) => {
  const { _id } = req.profile;
  await User.deleteOne({ _id }, (error) => {
    if (error) {
      res.status(400).json({ error });
    } else {
      res
        .status(200)
        .json({ message: "Your account has been deleted successfully." });
    }
  });
};

exports.followUser = (req, res) => {};

exports.unfollowUser = (req, res) => {};
