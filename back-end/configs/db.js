const mongoose = require("mongoose");
async function connectDB() {
  mongoose
    .connect("mongodb://127.0.0.1:27017/NodeMern")
    .then(() => console.log("Connected! "));
}
module.exports = { connectDB };
