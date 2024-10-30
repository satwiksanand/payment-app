const { JWT_SECRET_KEY } = require("../config");
const jwt = require("jsonwebtoken");
const { customError } = require("../utils/customError");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw customError(411, "Invalid Token!");
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, JWT_SECRET_KEY);
    req.userId = user.id;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authMiddleware,
};
