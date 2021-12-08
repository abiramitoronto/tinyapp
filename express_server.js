const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


function generateRandomString() {
    return "abcde" + Math.floor(Math.random() * 4);
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
  const templateVars = { username: req.params.username, urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  username = req.params.username;
  res.render("urls_new",username);
});

app.get("/urls/:shortURL", (req, res) => {
  //console.log(req.params.shortURL);
  //console.log("my response output" + res)
  const templateVars = { username : req.params.username, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
  //console.log(res.body);
  //res.redirect(req.params.longURL);
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
  console.log(res.cookie.user_id);
  res.render(`urls_index`,templateVars);
});

app.post("/urls/logout", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok Short URL is " + generateRandomString());         // Respond with 'Ok' (we will replace this)
  const templateVars = {
    username: null,
    urls : urlDatabase
  };
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
  const templateVars = { username : req.body.username, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});