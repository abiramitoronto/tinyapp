const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')


app.set("view engine", "ejs");
  const bodyParser = require("body-parser");
  const { generateRandomString, generateUserID, findEmailID, findUserByEmail, 
         authenticator, urlsforUserid, getHashedPassword, users, urlDatabase } = require("./helper");

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2' ],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(users);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const cookieUser = req.session.user_id;

  if (cookieUser === undefined) {
    const templateVars = {user : null, urls : null};
    res.render("urls_index",templateVars);
  } else {
    const userToDisplay = urlsforUserid(cookieUser,urlDatabase);
    const templateVars = {user : users[cookieUser], urls : userToDisplay};
    res.render("urls_index",templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const cookieUser = req.session.user_id;
  if (cookieUser === undefined) {
    const templateVars = {user : null};
    res.render("login",templateVars);
  } else {
    const userToDisplay = urlsforUserid(cookieUser,urlDatabase);
    const templateVars = {user : users[cookieUser]};
    res.render("urls_new",templateVars);
  }
});

app.get("/urls/login", (req, res) => {
  const cookieUser = req.session.user_id;
  const templateVars = {user : users[cookieUser]};
  res.render("login",templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shorturl = req.body.shortURL;
  const cookieUser = req.session.user_id;
  if (cookieUser === undefined) {
    const templateVars = {user : null, shortURL: null, longURL: null};
    res.render("login",templateVars)
  } else {
    const usersToDisplay = urlsforUserid(cookieUser,urlDatabase); 
    const keyArr = Object.keys(usersToDisplay);
    let getShort = "";;
    for (const itr of keyArr) {
      if (usersToDisplay[itr].userID === cookieUser) {
        getShort = itr;
      }
    }
    const getLong  = usersToDisplay[getShort].longURL;
    const templateVars = {user : users[cookieUser], shortURL : getShort , longURL : getLong};
    res.render("urls_show", templateVars);
  }
});

app.get("/register", (req,res) => {
  const templateVars = {user : null};
  res.render("register",templateVars);  
});

app.get("/login", (req,res) => {
  const cookieUser = req.session.user_id;
  if (cookieUser === undefined) {
    const templateVars = {user : null, shortURL: null, longURL: null};
    res.render("login",templateVars)
  } else {
    const usersToDisplay = urlsforUserid(cookieUser,urlDatabase); 
    const templateVars = {user : users[cookieUser], urls : usersToDisplay};
    res.render("urls_index",templateVars)
  }  
});

app.post("/urls", (req, res) => {
  const shorturl = generateRandomString();
  const cookieUser = req.session.user_id;
  const urlDB = {longURL : req.body.longURL, userID : cookieUser};
  urlDatabase[shorturl] = urlDB;
  res.redirect(`urls/${shorturl}`);
});

app.post("/urls/login", (req, res) => {
  const cookieUser = req.session.user_id;
  const templateVars = {user : users[cookieUser],urls : urlDatabase};
  res.render(`login`,templateVars);
});

app.post("/login", (req, res) => {
  const userIDByEmail = findUserByEmail(req.body.email,users);
  const email = req.body.email;
  const password = req.body.password;
  const credentialCheck = authenticator(email,password,users); 
  if (credentialCheck) {
    req.session.user_id = userIDByEmail;
    res.redirect(`/login`);
  } else {
    res.status(404).send('!!!Error : Email ID and Password credentials are incorrect');
  }
});

app.post("/urls/logout", (req, res) => {
  const templateVars = {user : null, urls : null};
  req.session = null;
  res.render(`urls_index`,templateVars);
});

app.post("/urls/:url/delete", (req, res) => {
  delete urlDatabase[req.params.url];
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL", (req, res) => {
  const cookieUser = req.session.user_id;
  const templateVars = {user : users[cookieUser], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL};
  res.render("urls_show", templateVars);
});

app.post("/register", (req,res) => {
  const id = generateUserID();
  const email = req.body.email;
  const password = req.body.password;
  const emailcheck = findEmailID(email);
  const hashedPassword = getHashedPassword(password);
  if (email.length === 0 || password.length === 0){
    res.status(404).send('!!!Error :Enter Email ID and Password');
    return;
  }
  if (!emailcheck) {    
    res.status(404).send('!!!Error :Email ID Already Exists');
    return;
  }
  const obj_test = {id : id,
                    email : email,
                    password : hashedPassword};
  users[id] = obj_test;
  res.redirect('/urls');
})

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect(`/urls`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});