const zod = require("zod");
const { customError } = require("../utils/customError");

const schema = zod.object({
  username: zod.string(),
  useremail: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string().min(6, "Password should be minimum of 6 characters"),
});

const ValidateNewUser = (req, res, next) => {
  const user = {
    username: req.body.username,
    useremail: req.body.useremail,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  };
  try {
    if (schema.safeParse(user).success) {
      next();
    } else {
      throw customError(411, "Invalid Inputs!");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  ValidateNewUser,
};
