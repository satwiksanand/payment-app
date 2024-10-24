const zod = require("zod");
const { customError } = require("../utils/customError");

const schema = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  password: zod.string().optional(),
});

const updateMiddleware = (req, res, next) => {
  try {
    if (!schema.safeParse(req.body).success) {
      throw customError(411, "Error while updating the user information!");
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateMiddleware,
};
