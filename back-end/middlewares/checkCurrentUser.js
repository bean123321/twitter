const jwt = require("jsonwebtoken");

exports.checkCurrentUser = (req, res, next) => {
  //access authorization from req header
  const Authorization = req.header("authorization");
  if (!Authorization) {
    req.user = null;
    next(); // goi den ham next de sang function tiep theo
  } else {
    //get token from Authorization
    const token = Authorization.replace("Bearer ", "");
    //verify token
    try {
      const { userId } = jwt.verify(token, process.env.APP_SECRET);
      req.user = { userId };
      //console.log("*****", userId);
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
};
