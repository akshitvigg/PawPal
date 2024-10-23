require("dotenv").config();
const express = require("express");
const { petsModel, userModel } = require("./db");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = "genius";
const { default: mongoose } = require("mongoose");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["https://paw-pal-frontend.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

mongoose.connect(process.env.MONGO_URL);

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const hashedpass = await bcrypt.hash(password, 5);
  let erroroccured = false;
  try {
    await userModel.create({
      username: username,
      email: email,
      password: hashedpass,
    });
  } catch (e) {
    erroroccured = true;
    res.status(400).json({
      message: "error while signing up",
    });
  }
  if (!erroroccured) {
    res.jsonp({
      message: "user created successfully",
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const finduser = await userModel.findOne({
    email,
  });
  if (!finduser) {
    res.status(400).json({
      message: "cant find user",
    });
  }
  const hashedpass = await bcrypt.compare(password, finduser.password);
  if (hashedpass) {
    const token = jwt.sign({ id: finduser._id }, process.env.secret);
    res.json({
      message: "Login successful",
      token: token,
    });
  } else {
    res.status(400).json({
      message: "error while login",
    });
  }
});

const auth = (req, res, next) => {
  const token = req.headers.token;
  const decodedtoken = jwt.verify(token, process.env.secret);
  if (decodedtoken.id) {
    req.UserId = decodedtoken.id;
    next();
  } else {
    res.json({
      message: "incorrect credentials",
    });
  }
};

app.post("/addpets", auth, async (req, res) => {
  const UserId = req.UserId;
  const { petname, pettype, breed, name, phn } = req.body;

  await petsModel.create({
    UserId: UserId,
    petname,
    pettype,
    breed,
    name,
    phn,
  });
  res.json({
    message: "Pet added successfully",
  });
});

app.get("/getpets", auth, async (req, res) => {
  const UserId = req.UserId;

  let erroroccured = false;
  try {
    const pets = await petsModel.find({
      UserId,
    });
    res.json(pets);
  } catch (e) {
    erroroccured = true;
    res.json({
      message: "cant show pets ",
    });
  }
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});