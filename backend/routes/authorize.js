const { Router } = require("express");
const { Users, Account } = require("../db");
const { JWT_SECRET_KEY } = require("../config");
const { customError } = require("../utils/customError");

const { ValidateNewUser } = require("../middleware/signUpValidation");
const { validateExistingUser } = require("../middleware/signInValidation");
const { authMiddleware } = require("../middleware/authMiddleware");

const jwt = require("jsonwebtoken");
const { updateMiddleware } = require("../middleware/updateMiddleware");
const authRouter = Router();

authRouter.post("/signup", ValidateNewUser, async (req, res, next) => {
  const { useremail } = req.body;
  try {
    const existingUser = await Users.findOne({ useremail });
    if (existingUser) {
      throw customError(411, "Email already in use!");
    }
    const user = await Users.create({
      useremail: req.body.useremail,
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    });

    //TODO : do we need a transaction here, i don't want to create a user without account!
    await Account.create({
      userId: user._id,
      balance: Math.floor(Math.random() * 100_000),
    });

    res.json({
      message: "User successfully created!",
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/signin", validateExistingUser, async (req, res, next) => {
  const { useremail, password } = req.body;
  try {
    const existingUser = await Users.findOne({ useremail });
    if (!existingUser || existingUser.password != password) {
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

authRouter.put(
  "/update",
  authMiddleware,
  updateMiddleware,
  async (req, res, next) => {
    const id = req.userId;
    try {
      await Users.updateOne({ _id: id }, req.body);
      res.json({
        message: "user information updated!",
      });
    } catch (err) {
      next(err);
    }
  }
);

authRouter.get("/all", authMiddleware, async (req, res, next) => {
  const filter = req.query.filter || "";
  const users = await Users.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

authRouter.use((req, res, next) => {
  throw customError(404, "route not found!");
});

module.exports = {
  authRouter,
};
