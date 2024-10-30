const { Router } = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { Account } = require("../db");
const { customError } = require("../utils/customError");
const { default: mongoose } = require("mongoose");

const accountRouter = Router();

accountRouter.get("/getBalance", authMiddleware, async (req, res, next) => {
  const userId = req.userId;
  try {
    const acc = await Account.findOne({ userId: userId });
    if (!acc) {
      throw customError(413, "account does not exist");
    }
    res.json({
      balance: acc.balance,
    });
  } catch (err) {
    next(err);
  }
});

accountRouter.post("/transfer", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.userId;
    const { to, amount } = req.body;
    console.log(typeof amount, to, amount);
    if (!to || amount <= 0 || typeof amount !== "number") {
      throw customError(400, "Invalid Details!");
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    const senderAccount = await Account.findOne({ userId: userId }).session(
      session
    );
    if (!senderAccount || senderAccount.balance < amount) {
      await session.abortTransaction();
      throw customError(400, "Insufficient balance!");
    }
    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      throw customError(400, "Account does not exists!");
    }
    await Account.updateOne(
      { userId: userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: to },
      {
        $inc: {
          balance: amount,
        },
      }
    ).session(session);
    await session.commitTransaction();
    res.json({
      message: "Transaction Successfull!",
    });
  } catch (err) {
    next(err);
  }
});

accountRouter.use((req, res, next) => {
  throw customError(500, "Route does not exist!");
});

module.exports = {
  accountRouter,
};
