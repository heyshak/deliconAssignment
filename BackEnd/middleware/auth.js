const config = require("config");
const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const token = req.header("authorization");

  if (!token) return res.status(401).json("No token ,autohrization denied");
  //Verify token
  try {
    const decode = jwt.verify(token, config.get("jwtSecret"));
    // console.log("decode " + decode.user);
    req.user = decode.user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json("Token is invalid");
  }
};
