const { Router } = require("express");
const { ValidateNewUser } = require("../middleware/signUpValidation");
const { validateExistingUser } = require("../middleware/signInValidation");
const { Users } = require("../db");
const { customError } = require("../utils/customError");
const { JWT_SECRET_KEY } = require("../config");
const jwt = require("jsonwebtoken");
const authRouter = Router();

authRouter.post("/signup", ValidateNewUser, async (req, res, next) => {
  const { useremail } = req.body;
  try {
    const existingUser = await Users.findOne({ useremail });
    if (existingUser) {
      throw customError(411, "Email already in use!");
    }
    await Users.create({
      useremail: req.body.useremail,
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    });
    res.json({
      message: "User successfully created!",
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/signin", validateExistingUser, async (req, res, next) => {
  const { useremail } = req.body;
  try {
    const existingUser = await Users.findOne({ useremail });
    if (!existingUser) {
      throw customError(413, "Error while signing in!");
    }
    const token = jwt.sign({ useremail, id: existingUser._id }, JWT_SECRET_KEY);
    res.json({
      message: "Login successfull!",
      token,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = {
  authRouter,
};
