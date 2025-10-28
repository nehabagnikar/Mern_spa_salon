const jwt = require("jsonwebtoken");

const middleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access, please login first",
      });
    }

    const decreptedData = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decrypted Data:", decreptedData);
    req.userId = decreptedData.userId;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = middleware;
