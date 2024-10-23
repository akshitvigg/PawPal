const mongoose = require("mongoose");
const schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
});

const Pets = new schema({
  UserId: ObjectId,
  petname: String,
  pettype: String,
  breed: String,
  name: String,
  phn: Number,
});

const petsModel = mongoose.model("petsData", Pets);
const userModel = mongoose.model("userdata", User);

module.exports = {
  petsModel: petsModel,
  userModel: userModel,
};
