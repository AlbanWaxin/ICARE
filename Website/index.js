const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const axios = require("axios");
const ejs = require("ejs");

const app = express();
const path = require("path");
const crypto = require('crypto');


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
  
function hashData(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

function isAuthenticated(req, res, next) {
  return req.session && req.session.user;
}

pathtopages = "frontend/pages/";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, pathtopages + "accueil.html"));
});

app.get("/main", (req, res) => {
  if (!isAuthenticated(req, res)) {
    return res.redirect("/login");
  }
  res.render(path.join(__dirname, pathtopages + "main"), { data: req.session.user.name });
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
    const response = await axios.post("http://localhost:6000/login", {
      username: req.body.username,
      password: hashData(req.body.password),
    });
    if (response.status === 200) {
      req.session.user = { name: req.body.username, pass: req.body.password };
      return res.redirect("/main");
    } else if (response.status === 205) {
      return res.redirect("/login");
    } else {
      return res.redirect("/");
    }
  }
});

app.get("/mas", async (req, res) => {
  if (!isAuthenticated(req, res)) {
    return res.redirect("/login");
  }
  const response = await axios.get(
    "http://localhost:6000/mas?user=" + req.session.user.name
    // "http://localhost:6000/mas?user=" + "CodeCubes"
  );
  webtoons = [];
  response.data.forEach((element) => {
    webtoons.push(element);
  });
  res.render(path.join(__dirname, pathtopages + "mas"), { data: webtoons });
});

app.get("/mas/add", async (req, res) => {
  if (!isAuthenticated(req, res)) {
    return res.redirect("/login");
  }
  let response = await axios.get(
    "http://localhost:6000/mas?user=" + req.session.user.name
    // "http://localhost:6000/mas?user=" + "CodeCubes"
  );
  followed = [];
  response.data.forEach((element) => {
    followed.push(element.link);
  });
  response = await axios.get("http://localhost:6000/mas/all");
  allwebtoons = [];
  response.data.forEach((element) => {
    allwebtoons.push(element);
  });
  res.render(path.join(__dirname, pathtopages + "masadd"), {
    followed: followed,
    data: allwebtoons,
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  return res.redirect("/login");
});

app.post("/mas/add", async (req, res) => {
  let url_list = [];
  console.log(req.body);
  for (var key in req.body) {
    url_list.push(req.body[key]);
  }
  console.log(url_list);
  const response = await axios.post("http://localhost:6000/mas/add", {
    user: req.session.user.name,
    url_list: url_list,
  });
  return res.redirect("/mas");
});

app.post("/register", (req, res) => {
  if (req.body.username && req.body.password) {
    axios
      .post("http://localhost:6000/register", {
        email: req.body.email,
        username: req.body.username,
        password: hashData(req.body.password),
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

app.post("/update_chapter", async (req, res) => {
  console.log("trigger", req.body.chapter);
  if (req.body.webtoon && req.body.chapter) {
    const response = axios.post("http://localhost:6000/mas/update_chapter", {
      webtoon: req.body.webtoon,
      chapter: +req.body.chapter.replace("Chapter ", ""),
      user: req.session.user.name,
    });
    if (response.status === 200) {
      return res.redirect("/mas");
    } else {
      return res.redirect("/mas");
    }
  }
  return res.redirect("/mas");
});

app.post("/set_finished", async (req, res) => {
  if (req.body.webtoon) {
    const response = await axios.post(
      "http://localhost:6000/mas/set_finished",
      {
        user: req.session.user.name,
        webtoon: req.body.webtoon,
      }
    );
    if (response.status === 200) {
      return res.redirect("/mas");
    } else {
      return res.redirect("/mas");
    }
  }
});

app.post("/set_unfinished", async (req, res) => {
  if (req.body.webtoon) {
    const response = await axios.post(
      "http://localhost:6000/mas/set_unfinished",
      {
        user: req.session.user.name,
        webtoon: req.body.webtoon,
      }
    );
    if (response.status === 200) {
      return res.redirect("/mas");
    } else {
      return res.redirect("/mas");
    }
  }
});

app.post("/set_dropped", async (req, res) => {
  if (req.body.webtoon) {
    const response = await axios.post("http://localhost:6000/mas/set_dropped", {
      user: req.session.user.name,
      webtoon: req.body.webtoon,
    });
    if (response.status === 200) {
      return res.redirect("/mas");
    } else {
      return res.redirect("/mas");
    }
  }
});

app.post("/set_undrop", async (req, res) => {
  if (req.body.webtoon) {
    const response = await axios.post("http://localhost:6000/mas/set_undrop", {
      user: req.session.user.name,
      webtoon: req.body.webtoon,
    });
    if (response.status === 200) {
      return res.redirect("/mas");
    } else {
      return res.redirect("/mas");
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});
