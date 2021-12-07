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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  //console.log(req.params.shortURL);
  //console.log("my response output" + res)
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
  //console.log(res.body);
  //res.redirect(req.params.longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok Short URL is " + generateRandomString());         // Respond with 'Ok' (we will replace this)
  const shorturl = generateRandomString();
  urlDatabase[shorturl] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`urls/${shorturl}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});