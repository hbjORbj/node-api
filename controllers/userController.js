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
    }
    req.profile = user;
    next();
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
      res.json({ users: users });
    }
  }).select("name email created updated");
};

/* 
**
Get a single user
**
*/
exports.getUser = (req, res) => {
  const { _id, name, email, created, updated } = req.profile;
  res.json({ _id, name, email, created, updated });
};

/*
**
Update a user
**
*/
exports.updateUser = async (req, res) => {
  const { _id, created, updated } = req.profile;
  const { name, email } = req.body;
  await User.updateOne({ _id }, { name, email, updated: Date.now() });
  res.json({ _id, name, email, created, updated });
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
