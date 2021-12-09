const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

function generateRandomString() {
    return "abcde" + Math.floor(Math.random() * 4);
}

function generateUserID() {
  return "users" + Math.random().toString(36).substr(2,8);
}
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const CookieUser = req.cookies['user_id'];
  const templateVars = {user : users[CookieUser], urls : urlDatabase};
  res.render("urls_index",templateVars);
});

app.get("/urls/new", (req, res) => {
  username = req.params.username;
  res.render("urls_new",username);
});

app.get("/urls/:shortURL", (req, res) => {
  //console.log(req.params.shortURL);
  //console.log("my response output" + res)
  //const templateVars = { username : req.params.username, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  const CookieUser = req.cookies['user_id'];
  const templateVars = {user : users[CookieUser]};
  res.render("urls_show", templateVars);
  //console.log(res.body);
  //res.redirect(req.params.longURL);
});

app.get("/register", (req,res) => {
  const templateVars = {user : null};

res.render("register",templateVars);  
});

app.post("/urls", (req, res) => {
 // console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok Short URL is " + generateRandomString());         // Respond with 'Ok' (we will replace this)
  const shorturl = generateRandomString();
  urlDatabase[shorturl] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`urls/${shorturl}`);
});

app.post("/urls/login", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok Short URL is " + generateRandomString());         // Respond with 'Ok' (we will replace this)
  const templateVars = {
    username: req.body.username,
    urls : urlDatabase
  };
  res.cookie('user_id',req.body.username);
  //console.log("urls/login " + res.cookie('user_id'));
  //console.log(res.cookie.user_id);
  res.render(`urls_index`,templateVars);
});

app.post("/urls/logout", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok Short URL is " + generateRandomString());         // Respond with 'Ok' (we will replace this)
  //const templateVars = {
  //  username: null,
  //  urls : urlDatabase
  //};
  const CookieUser = req.cookies['user_id'];
  const templateVars = {user : users[CookieUser]};
  res.clearCookie('user_id',req.body.username);
  console.log("urls/logout " + req.body.username);
  res.render(`urls_index`,templateVars);
});

app.post("/urls/:url/delete", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok Short URL is " + generateRandomString());         // Respond with 'Ok' (we will replace this)
  console.log("Request Param " + req.params.url);
  delete urlDatabase[req.params.url];
  console.log(urlDatabase);
  console.log("worked");
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL", (req, res) => {
  //console.log(req.params.shortURL);
  //console.log("my response output" + res)
  //const templateVars = { username : req.body.username, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  const CookieUser = req.cookies['user_id'];
  const templateVars = {user : users[CookieUser]};
  console.log(res.cookie.user_id);
  res.render("urls_show", templateVars);
  //console.log(res.body);
  //res.redirect(req.params.longURL);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok Short URL is " + generateRandomString());         // Respond with 'Ok' (we will replace this)
  console.log("Request Param " + req.params.shortURL);
  urlDatabase[req.params.shortURL] = req.body.longURL;
  console.log(urlDatabase);
  console.log("worked" + req.body.username);
  res.redirect(`/urls`);
});

app.post("/register" , (req,res) => {

  const id = generateUserID();
  const email = req.body.email;
  const password = req.body.password;
  res.cookie("user_id",id);
  const obj = {id,
               email,
               password};
  users[id] = obj;
  console.log(users);
  res.redirect('/urls');
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});