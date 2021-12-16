const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')

//setting EJS as template engine
app.set("view engine", "ejs");
  const bodyParser = require("body-parser");
  const { generateRandomString, generateUserID, findEmailID, findUserByEmail, 
         authenticator, urlsforUserid, getHashedPassword, users, urlDatabase } = require("./helper");

// Encoding Input Entry data         
app.use(bodyParser.urlencoded({extended: true}));

// To define no of Cookies
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2' ],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// Activate the Cookie Parser
app.use(cookieParser());

// GET request to route into Main page
app.get("/", (req, res) => {
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

// GET request to display contents of in Memory database 
app.get("/urls.json", (req, res) => {
  res.json(users);
});

// GET request to send hello message
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//GET request to route into Main Page
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

// GET request to show page for entering new long URL
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

// GET request to user Login Page
app.get("/urls/login", (req, res) => {
  const cookieUser = req.session.user_id;
  const templateVars = {user : users[cookieUser]};
  res.render("login",templateVars);
});

// GET request to redirect into Long URL page
app.get("/u/:shortURL", (req, res) => {
  const shorturl = req.params.shortURL;
  const cookieUser = req.session.user_id;
  if (cookieUser === undefined) {
    const templateVars = {user : null, shortURL: null, longURL: null};
    res.render("login",templateVars)
  } else {
    const getLong  = urlDatabase[shorturl].longURL;
    if (getLong.startsWith("http://") || getLong.startsWith("https://")) {
      res.redirect(getLong);
    } else {
      res.send("Invalid URL");
    }
  }
});

// GET request to redirect into Long URL page
app.get("/urls/:shortURL", (req, res) => {
  const shorturl = req.params.shortURL;
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

// GET request to redirect to Registration page
app.get("/register", (req,res) => {
  const templateVars = {user : null};
  res.render("register",templateVars);  
});

// GET request to Login page
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

// Receives data from Create new URL form and route this to URL mapping page
app.post("/urls", (req, res) => {
  const shorturl = generateRandomString();
  const cookieUser = req.session.user_id;
  const urlDB = {longURL : req.body.longURL, userID : cookieUser};
  urlDatabase[shorturl] = urlDB;
  res.redirect(`urls/${shorturl}`);
});

// Receives data from login page and route this to Main page
app.post("/urls/login", (req, res) => {
  const cookieUser = req.session.user_id;
  const templateVars = {user : users[cookieUser],urls : urlDatabase};
  res.render(`login`,templateVars);
});

// Receives data from login page and authenticate the users
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

// Logout the page and clears the Cookies.
app.post("/urls/logout", (req, res) => {
  const templateVars = {user : null, urls : null};
  req.session = null;
  res.render(`urls_index`,templateVars);
});

// Delete the URLs from the Main Page only by Logged in users.
app.post("/urls/:url/delete", (req, res) => {
  delete urlDatabase[req.params.url];
  res.redirect(`/urls`);
});

// Redirects the page to URLS list that belogs to particular logged in user
app.post("/urls/:shortURL", (req, res) => {
  const cookieUser = req.session.user_id;
  const templateVars = {user : users[cookieUser], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL};
  res.render("urls_show", templateVars);
});

// Adds the user to in memery database only when input Email ID does not exist. 
app.post("/register", (req,res) => {
  const id = generateUserID();
  const email = req.body.email;
  const password = req.body.password;
  if (email.length === 0 || password.length === 0){
    res.status(404).send('!!!Error :Enter Email ID and Password');
    return;
  }
  const emailcheck = findEmailID(email);
  if (!emailcheck) {    
    res.status(404).send('!!!Error :Email ID Already Exists');
    return;
  }
  const hashedPassword = getHashedPassword(password);
  const obj_test = {id : id,
                    email : email,
                    password : hashedPassword};
  users[id] = obj_test;
  req.session.user_id = id;
  res.redirect('/urls');
})

// Edits the Long URL that is mapped to Short URL by valid logged on user
app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect(`/urls`);
});

// To listen port on 8080

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});