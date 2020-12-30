const express = require("express");
const {
  logout,
  login,
  signUp,
  sendPasswordResetLink,
  resetPassword,
} = require("../controllers/globalController");
const {
  loginValidator,
  signUpValidator,
  emailValidator,
  passwordValidator,
} = require("../middlewares");
const globalRouter = express.Router();

// GET method
globalRouter.get("/logout", logout);

// POST method
globalRouter.post("/login", loginValidator, login);
globalRouter.post("/signup", signUpValidator, signUp);

// PUT method
globalRouter.put("/forgot-password", emailValidator, sendPasswordResetLink);
globalRouter.put("/reset-password", passwordValidator, resetPassword);

module.exports = globalRouter;
