const jwt = require("jsonwebtoken");
const verify = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.send("please log in ");
  } else {
    jwt.verify(token, "mysecretkey", (error, result) => {
      if (error) {
        res.send("invallid token ");
      } else {
        req.userId = result.id;
        next();
      }
    });
  }
};

module.exports = verify;
