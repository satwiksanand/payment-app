const mongoose = require("mongoose");
const connectionString = process.env.DATABASE_CONNECTION_STRING;
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log(err.message || err);
    console.log(connectionString);
  });

const userSchema = new mongoose.Schema({
  useremail: String,
  username: String,
  firstName: String,
  lastName: String,
  password: String,
});

const Users = mongoose.model("Users", userSchema);

module.exports = {
  Users,
};
