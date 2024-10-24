const { Router } = require("express");
const router = Router();
const { authRouter } = require("./authorize");
// const { accountRouter } = require("./account");

router.use("/auth", authRouter);
// router.use("/account", accountRouter);

router.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    message: err.message ? err.message : "something up with the server",
  });
});

module.exports = {
  router,
};
