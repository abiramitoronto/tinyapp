const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');


app.set("view engine", "ejs");

//const urlDatabase = {
//  "b2xVn2": "http://www.lighthouselabs.ca",
//  "9sm5xK": "http://www.google.com"
//};

const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
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
  },
  "aJ48lW": {
    id: "aJ48lW", 
    email: "user3@example.com", 
    password: "funk"
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

function findEmailID(email) {
  for (const val in users) {
    const user = users[val];
      if (user.email === email) {
        return false;
      }
  }
  return true;
}

const findUserByEmail = (email,users) => {
  for (let itr in users) {
    const userdet = users[itr];
    if (userdet.email === email) {
      return userdet;
    }
  } return false;
}; 

const authenticator = (email,password,users) => {
  for (let itr in users) {
    const usercred = users[itr];
    if (usercred.email === email && usercred.password === password) {
      return true;
    }
  } return false;
};

const urlsforUserid = (id, urlsDB) => {
  const filterID = {};
  for (const itr in urlsDB) {
    const userIDScan = urlsDB[itr];
    if (userIDScan.userID === id) {
      const tempObj = {longURL : userIDScan.longURL, userID : userIDScan.id};
      filterID[itr] = tempObj;
    }
    console.log(filterID);
  } return filterID;
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

  if (CookieUser === undefined) {
    const templateVars = {user : null, urls : null};
    res.render("urls_index",templateVars);
  } else {
    const userToDisplay = urlsforUserid(CookieUser,urlDatabase);
    const templateVars = {user : users[CookieUser], urls : userToDisplay};
    res.render("urls_index",templateVars);
  }
  //const templateVars = {user : null, urls : null};
  //res.render("urls_index",templateVars);  
  //const templateVars = {user : null, urls : urlDatabase};
  //res.render("urls_index",templateVars);
});

app.get("/urls/new", (req, res) => {
  //username = req.params.username;
  //res.render("urls_new",username);
  const CookieUser = req.cookies['user_id'];
  
  console.log(CookieUser);
  if (CookieUser === undefined) {
    const templateVars = {user : null};
    res.render("login",templateVars);
  } else {
    const userToDisplay = urlsforUserid(CookieUser,urlDatabase);
    const templateVars = {user : users[CookieUser]};
    res.render("urls_new",templateVars);
  }
});

app.get("/urls/login", (req, res) => {
  //console.log(req.params.shortURL);
  //console.log("my response output" + res)
  //const templateVars = { username : req.params.username, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  const CookieUser = req.cookies['user_id'];
  const templateVars = {user : users[CookieUser]};
  res.render("login",templateVars);
  //console.log(res.body);
  //res.redirect(req.params.longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  //console.log(req.params.shortURL);
  //console.log("my response output" + res)
  //const templateVars = { username : req.params.username, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  console.log("get /urls/:shortURL");
  const shorturl = req.body.shortURL;
  if (users[shorturl]) {
    const CookieUser = req.cookies['user_id'];
    if (CookieUser === undefined) {
      const templateVars = {user : null, shortURL: null, longURL: null};
      res.render("login",templateVars)
    } else {
      const usersToDisplay = urlsforUserid(CookieUser,urlDatabase); 
      const templateVars = {user : users[CookieUser], urls : usersToDisplay};
      res.render("urls_show", templateVars);
    }
  } else {
    res.status(404).send('URL is not present in the DB');
  }
  //console.log(res.body);
  //res.redirect(req.params.longURL);
});

app.get("/register", (req,res) => {
  const templateVars = {user : null};

res.render("register",templateVars);  
});

app.get("/login", (req,res) => {

  const CookieUser = req.cookies['user_id'];
  //console.log("CookieUser" + CookieUser);
  //res.cookie("user_id",req.body.email);
  if (CookieUser === undefined) {
    const templateVars = {user : null, shortURL: null, longURL: null};
    res.render("login",templateVars)
  } else {
    console.log(CookieUser);
    const usersToDisplay = urlsforUserid(CookieUser,urlDatabase); 
    const templateVars = {user : users[CookieUser], urls : usersToDisplay};
    console.log("userstoDisplay " + usersToDisplay);
    res.render("urls_index",templateVars)
  }  
});

app.post("/urls", (req, res) => {
 // console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok Short URL is " + generateRandomString());         // Respond with 'Ok' (we will replace this)
  const shorturl = generateRandomString();
  const genUserID = generateUserID();
  const urlDB = {longURL : req.body.longURL, userID : genUserID};
  urlDatabase[shorturl] = urlDB;
  console.log(urlDatabase);
  res.redirect(`urls/${shorturl}`);
});

app.post("/urls/login", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok Short URL is " + generateRandomString());         // Respond with 'Ok' (we will replace this)
  const CookieUser = req.cookies['user_id'];
  //res.cookie("user_id",req.body.email);
  const templateVars = {user : users[CookieUser],urls : urlDatabase};
  console.log("urls/login");
  //res.cookie('user_id',req.body.username);
  //console.log("urls/login " + res.cookie('user_id'));
  //console.log(res.cookie.user_id);
  res.render(`login`,templateVars);
});

app.post("/login", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok Short URL is " + generateRandomString());         // Respond with 'Ok' (we will replace this)
  //console.log("login worked")
  //const CookieUser = res.cookies['user_id'];
  //console.log(req.body.email);
  const userByEmail = findUserByEmail(req.body.email,users);
  const email = req.body.email;
  const password = req.body.password;
  const cred_check = authenticator(email,password,users); 
  if (cred_check) {
    res.cookie("user_id",userByEmail.id);
    res.redirect(`/login`);
  } else {
    res.status(404).send('!!!Error : Email ID and Password credentials are incorrect');
  }
  //console.log("userbyEmail" + userByEmail);
  
});

app.post("/urls/logout", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok Short URL is " + generateRandomString());         // Respond with 'Ok' (we will replace this)
  //const templateVars = {
  //  username: null,
  //  urls : urlDatabase
  //};
  const CookieUser = req.cookies['user_id'];
  const templateVars = {user : null, urls : null};
  res.clearCookie('user_id');
  //console.log("urls/logout " + req.body.username);
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
  const templateVars = {user : users[CookieUser], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL};
  console.log(res.cookie.user_id);
  res.render("urls_show", templateVars);
  //console.log(res.body);
  //res.redirect(req.params.longURL);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok Short URL is " + generateRandomString());         // Respond with 'Ok' (we will replace this)
  console.log("Request Param " + req.params.shortURL);
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  console.log(urlDatabase);
  console.log("worked" + req.body.username);
  res.redirect(`/urls`);
});

app.post("/register" , (req,res) => {

  const id = generateUserID();
  const email = req.body.email;
  const password = req.body.password;
  const emailcheck = findEmailID(email);
  const cred_check = authenticator(email,password,users); 
  if (email.length !== 0 && password.length !== 0) {
    console.log(emailcheck);
    if (emailcheck) { 
    res.cookie("user_id",id);
    const obj = {id,
               email,
               password};
    users[id] = obj;
    //console.log(users);
    res.redirect('/urls');
    return;
    } else {
      console.log("Email Working");
      res.status(404).send('!!!Error :Email ID Already Exists');
    } 
  }
  res.status(404).send('!!!Error :Enter Email ID and Password');
  
  
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});