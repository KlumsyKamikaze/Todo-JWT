const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const bodyParser = require('body-parser');
const verifyToken = require('./routes/verifyToken');
const authRoute = require("./routes/auth");
const todoRoute = require("./routes/todo");
const cookieParser = require('cookie-parser');


mongoose.connect(
  "mongodb+srv://Ishaan:Mouse123@cluster0.o0tfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true },
  () => {
    console.log("connected to database");
  }
);

// Middleware
app.use(express.json());
app.use(express.static('views'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/home", (req, res) => {
  res.sendFile("/views/index.html", {root:__dirname});
});

app.get("/register", (req,res) => {
  res.sendFile(path.resolve("views/register.html"));
  console.log(__dirname);
})

app.get("/login", (req,res) => {
  res.sendFile(path.resolve("views/login.html"));
})

app.get('/logout',(req,res) => {
  res.clearCookie("authToken").redirect("/home");
})

app.get('/todo',verifyToken,(req,res) => {
  console.log("sendFile process started")
  res.sendFile(path.resolve("views/todo.html"))
})

app.use("/api/user", authRoute);
app.use("/api/todo", todoRoute)

app.listen(3000, () => console.log("server is running now"));
