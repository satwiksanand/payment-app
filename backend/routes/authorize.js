const { Router } = require("express");
const { ValidateNewUser } = require("../middleware/signUpValidation");
const { Users } = require("../db");
const { customError } = require("../utils/customError");
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

module.exports = {
  authRouter,
};
