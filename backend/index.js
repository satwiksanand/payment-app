const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const { router } = require("./routes/index");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1", router);

app.listen(3000, () => {
  console.log("server is listening on port 3000!");
});
