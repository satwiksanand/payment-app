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
  useremail: {
    type: String,
    required: true,
  },
  username: String,
  firstName: String,
  lastName: String,
  password: {
    type: String,
    required: true,
  },
});

const Users = mongoose.model("users", userSchema);

module.exports = {
  Users,
};
