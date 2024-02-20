const jwt = require("jsonwebtoken");
function isExpiredToken(token) {
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Date.now() / 1000;
  // console.log("exp", tokenPayload.exp, "current", currentTime)
  return tokenPayload.exp < currentTime;
}
exports.verifyToken = (req, res, next) => {
  //lấy quyền truy cập từ req được gắn ở trong header
  const Authorization = req.header("authorization");

  //lấy token
  const token = Authorization.replace("Bearer ", ""); //nhớ ph có cả dấy space

  if (!token || String(token) === "null" || isExpiredToken(token)) {
    //nếu chưa dnhap, chưa cung cấp token
    const err = new Error("Unauthorization");
    err.statusCode = 401;
    return next(err); //gửi xuống hàm errorHandler để xử lý
  }

  //verify
  const { userId } = jwt.verify(token, process.env.APP_SECRET);

  //assign req
  req.user = { userId };
  next();
};
