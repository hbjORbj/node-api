const jwt = require("jsonwebtoken");
const { sendEmail } = require("../helpers");
const User = require("../models/User");
const _ = require("lodash");

/* 
**
Sign Up
**
*/
exports.signUp = async (req, res) => {
  // Check if user is already registered
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(403).json({
      error: "You are an already registered user.",
    });
  } else {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "You're Signed Up! Please Log in and Enjoy!" });
  }
};

/* 
**
Log In
**
*/
exports.login = async (req, res) => {
  // Find the user using email
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // user exists
  if (user) {
    // correct password
    if (user.authenticate(password)) {
      // generate a token using user id and secret
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      // create a cookie with token and expiry time of 2 hours
      res.cookie("t", token, { expire: new Date() + 7200000 });

      // return response with token and user's information except password to the front-end client
      const { _id, name, email } = user;
      return res.json({ token, user: { _id, name, email } });
    } else {
      // incorrect password
      res.status(401).json({
        error: "Incorrect password.",
      });
    }
  }

  // user does not exist
  else {
    res.status(401).json({
      error: "You are not a registered user.",
    });
  }
};

/* 
**
Log Out
**
*/
exports.logout = (req, res) => {
  res.clearCookie("t");
  return res.json({ message: "You're signed out!" });
};

/* 
**
Send Password Reset Link
**
*/
exports.sendPasswordResetLink = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(401)
        .json({ error: "User with this email addres does not exist." });
    }

    const token = jwt.sign(
      { _id: user._id, iss: process.env.APP_NAME },
      process.env.JWT_SECRET
    );

    const emailData = {
      from: "noreply@sns-node.com",
      to: email,
      subject: "Password Reset Link",
      text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`,
    };

    user.updateOne({ resetPasswordLink: token }, (err, result) => {
      if (err) return res.json({ error: err });
      else {
        sendEmail(emailData);
        return res.json({
          message: `Reset Link has been sent to ${email}. Follow the instructions to reset your password.`,
        });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  User.findOne({ resetPasswordLink }, (err, user) => {
    if (err || !user)
      return res.status(401).json({
        error: "Invalid Link!",
      });

    const updatedFields = {
      password: newPassword,
      resetPasswordLink: "",
    };

    user = _.extend(user, updatedFields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      } else {
        return res.json({
          message: `Success! Now you can login with your new password.`,
        });
      }
    });
  });
};
