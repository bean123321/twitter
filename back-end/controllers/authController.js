//authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generalAccessToken = (data) => {
  const access_token = jwt.sign(data, process.env.APP_SECRET, {
    expiresIn: "2s",
  });
  return access_token;
};

const generalRefreshToken = (data) => {
  const refresh_token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return refresh_token;
};

exports.register = async (req, res, next) => {
  try {
    // req.body - name,email,password
    const user = await User.create(req.body);
    const token = generalAccessToken({ userId: user._id });
    res.status(200).json({
      status: "success",
      data: { token, userName: user.name },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    // req.body - name,email,password
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      //email is not correct
      const err = new Error("Email is not correct");
      err.statusCode = 400;
      return next(err);
    }
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const access_token = generalAccessToken({ userId: user._id });
      const refresh_token = generalRefreshToken({ userId: user._id });

      res.status(200).json({
        status: "success",
        data: { access_token, refresh_token, userName: user.name },
      });
    } else {
      //password is not correct
      const err = new Error("Password is not correct");
      err.statusCode = 400;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};
exports.token = (req, res, next) => {
  //refresh the damn token
  const postData = req.body;
  //console.log("data", postData);
  const userId = jwt.verify(
    postData.refresh_token,
    process.env.REFRESH_TOKEN_SECRET
  );
  // console.log("userId", userId);
  // if refresh token exists
  if (userId) {
    //console.log("userId", userId.userId);
    const newRefreshToken = generalRefreshToken({ userId: userId.userId });
    const newAccessToken = generalAccessToken({ userId: userId.userId });
    //console.log("newRefreshToken", newRefreshToken);
    //console.log("newAccessToken", newAccessToken);
    res.status(200).json({
      newAccessToken: newAccessToken,
      newRefreshToken: newRefreshToken,
    });
  }
  // if (postData.refresh_token) {
  //   const token = jwt.sign({ userId: userId }, process.env.APP_SECRET, {
  //     expiresIn: "1m",
  //   });
  //   const response = {
  //     token: token,
  //     refresh_token: postData.refresh_token,
  //   };
  //   // update the token in the list
  //   res.status(200).json(response);
  // }
  else {
    res.status(404).send("Invalid request");
  }
  // const Authorization = req.header('authorization')
  // console.log(Authorization);
  // console.log(req.body)
  // res.status(200).json({
  //     status: 'success',
  //     data: "Authorization"
  // })
};
//get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    const data = { user: null };
    if (req.user) {
      const user = await User.findOne({ _id: req.user.userId });
      data.user = { userName: user.name };
    } else {
      const err = new Error("Unauthorization");
      err.statusCode = 401;
      return next(err);
    }
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    res.json(error);
  }
};
