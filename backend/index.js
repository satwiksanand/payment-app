const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { authRouter } = require("./routes/authorize");

console.log(process.env.DATABASE_CONNECTION_STRING);

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({
    message: "this is the world famous landing page!",
  });
});

app.use("/auth", authRouter);

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    message: err.message ? err.message : "something up with the server",
  });
});

app.listen(3000, () => {
  console.log("server is listening on port 3000!");
});
