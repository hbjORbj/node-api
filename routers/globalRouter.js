const express = require("express");
const {
  logout,
  login,
  signUp,
  sendPasswordResetLink,
  resetPassword,
} = require("../controllers/globalController");
const { loginValidator, signUpValidator } = require("../middlewares");
const globalRouter = express.Router();

// GET method
globalRouter.get("/logout", logout);

// POST method
globalRouter.post("/login", loginValidator, login);
globalRouter.post("/signup", signUpValidator, signUp);

// PUT method
globalRouter.put("/forgot-password", sendPasswordResetLink);
globalRouter.put("/reset-password", resetPassword);

module.exports = globalRouter;
