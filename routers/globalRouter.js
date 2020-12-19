const express = require("express");
const { logout, login, signUp } = require("../controllers/globalController");
const { loginValidator, signUpValidator } = require("../middlewares");
const globalRouter = express.Router();

// GET method
globalRouter.get("/logout", logout);

// POST method
globalRouter.post("/login", loginValidator, login);
globalRouter.post("/signup", signUpValidator, signUp);

module.exports = globalRouter;
