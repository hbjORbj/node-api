const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

      // create a cookie with token and expiry time of 5 minutes
      res.cookie("t", token, { expire: new Date() + 3000000 });

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
Find User by id
and Add a profile object (filled with user info) to req
**
*/
exports.userById = (req, res, next, id) => {
  const user = User.findById(id);
  if (user) {
    req.profile = user;
    next();
  } else {
    res.status(400).json({
      error: "User not found.",
    });
  }
};
