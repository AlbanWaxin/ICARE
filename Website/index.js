const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const axios = require("axios");
const ejs = require("ejs");

const app = express();
const path = require("path");

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//files accessible for the front page
app.use(express.static("frontend"));

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect("/login");
  }
}

pathtopages = "frontend/pages/";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, pathtopages + "accueil.html"));
});

app.get("/main", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, pathtopages + "main.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, pathtopages + "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, pathtopages + "register.html"));
});

app.post("/login", async (req, res) => {
  if (req.body.username && req.body.password) {
    console.log(req.body.username, req.body.password);
    const response = await axios.post("http://localhost:5100/login", {
      username: req.body.username,
      password: req.body.password,
    });
    if (response.status === 200) {
      req.session.user = { name: req.body.username, pass: req.body.password };
      return res.redirect("/mas");
    } else if (response.status === 205) {
      return res.redirect("/login");
    } else {
      redirect("/");
    }
  }
});

app.get("/mas", async (req, res) => {
  const response = await axios.get(
    "http://localhost:6000/mas?user=" + req.session.user.name
  );
  webtoons = [];
  response.data.forEach((element) => {
    webtoons.push(element);
  });
  res.render(path.join(__dirname, pathtopages + "mas"), { data: webtoons });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  return res.redirect("/login");
});

app.post("/register", (req, res) => {
  if (req.body.username && req.body.password) {
    axios
      .post("http://localhost:5100/register", {
        username: req.body.username,
        password: req.body.password,
      })
      .then((response) => {
        if (response.data) {
          return res.redirect("/login");
        } else {
          return res.redirect("/register");
        }
      });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});
