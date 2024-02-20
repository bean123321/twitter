// authRoute.js
const jwt = require("jsonwebtoken");
const express = require("express");
const {
  login,
  register,
  getCurrentUser,
  token,
} = require("../controllers/authController");
const { checkCurrentUser } = require("../middlewares/checkCurrentUser");
const Router = express.Router();

Router.route("/register").post(register);
Router.route("/login").post(login);
Router.route("/token").post(token);
Router.route("/").get(checkCurrentUser, getCurrentUser);
module.exports = Router;
