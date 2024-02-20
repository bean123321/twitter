//server.js

/////
//dotenv
require("dotenv").config();
// connect db
const { connectDB } = require("./configs/db");
connectDB();
//----------
const express = require("express");

const cors = require("cors");

//import route
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
//import errorHandler
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

// Cors
app.use(cors());

//BodyParser
app.use(express.json());

//Mount the route
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/posts", postRoute);

//unhandled routes
app.all("*", (req, res, next) => {
  const err = new Error("The route can not be found");
  err.statusCode = 404;
  next(err);
});
app.use(errorHandler);

app.get("/", (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      posts: [
        {
          content: "Hello",
          date: "2023",
        },
      ],
    },
  });
});

//const port = 5000;
const port = process.env.APP_PORT;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
