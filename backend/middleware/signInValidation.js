const zod = require("zod");
const { customError } = require("../utils/customError");

const schema = zod.object({
  useremail: zod.string().email(),
  password: zod.string().min(6),
});

const validateExistingUser = (req, res, next) => {
  const existingUser = {
    useremail: req.body.useremail,
    password: req.body.password,
  };
  try {
    if (schema.safeParse(existingUser).success) {
      next();
    } else {
      throw new customError(411, "Invalid Credentials!");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validateExistingUser,
};
