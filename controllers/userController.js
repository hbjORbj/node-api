const User = require("../models/User");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

/* 
**
Find user by id
and add a profile object (filled with user info) to req
**
*/
exports.userById = (req, res, next, id) => {
  User.findById(id)
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((error, user) => {
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

/* 
**
Get a user's photo
**
*/
exports.getUserPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set(("Content-Type", req.profile.photo.contentType));
    return res.send(req.profile.photo.data);
  }
  next();
};

/*
**
Update a user
**
*/
exports.updateUser = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Photo could not be uploaded." });
    } else {
      let user = req.profile;
      user = _.extend(user, fields);
      user.updated = Date.now();
      if (files.photo) {
        user.photo.data = fs.readFileSync(files.photo.path);
        user.photo.contentType = files.photo.type;
      }
      user.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        } else {
          user.hashedPassword = undefined;
          user.salt = undefined;
          res.json(user);
        }
      });
    }
  });
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

exports.addFollowing = async (req, res, next) => {
  const { userId, targetId } = req.body;
  await User.findByIdAndUpdate(
    { _id: userId },
    {
      $push: { following: targetId },
    },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      next();
    }
  );
};

exports.addFollower = async (req, res) => {
  const { userId, targetId } = req.body;
  await User.findByIdAndUpdate(
    { _id: targetId },
    { $push: { followers: userId } },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        result.hashedPassword = undefined;
        result.salt = undefined;
        return res.json(result);
      }
    });
};

exports.removeFollowing = async (req, res, next) => {
  const { userId, targetId } = req.body;
  await User.findByIdAndUpdate(
    { _id: userId },
    {
      $pull: { following: targetId },
    },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      next();
    }
  );
};

exports.removeFollower = async (req, res) => {
  const { userId, targetId } = req.body;
  await User.findByIdAndUpdate(
    { _id: targetId },
    {
      $pull: { followers: userId },
    },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("following", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        result.hashedPassword = undefined;
        result.salt = undefined;
        return res.json(result);
      }
    });
};
