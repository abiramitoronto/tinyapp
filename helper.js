const bcrypt = require('bcryptjs');

// In Memory URL database
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

// In memory user database
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
  },
  "userxyz02": {
    id: "userxyz02", 
    email: "hashed@test.com", 
    password: "$2a$10$zQvazZ/vVqf.IrDXEbHIBegl6i1zBcSuqlYadEiG8V4Gi0uy7FPMa"
  }
};


// This function generates random 6 digit short URL
function generateRandomString() {
  return Math.random().toString(36).substr(2,6);
}

// This function generates random userId to store in users database during registration process
function generateUserID() {
  return "users" + Math.random().toString(36).substr(2,8);
}

// This function checks existance of input Email ID in users database during registration process
function findEmailID(email) {
  let count = 0;
  for (const val in users) {
      const user = users[val]; 
      if (user.email === email) {
        return false;
      }
  }
  return true;
}

// This function pulls user ID that is attached to the Email ID
const findUserByEmail = (email,users) => {
  for (let itr in users) {
    const userDetails = users[itr];
    if (userDetails.email === email) {
      return userDetails.id;
    }
  } return undefined;
}; 

// This function authenticates user id and hashed password against users database
const authenticator = (email,password,users) => {
  for (let itr in users) {
    const userCred = users[itr];
    if (userCred.email === email && bcrypt.compareSync(password,userCred.password)) {
      return true;
    }
  } return false;
};


// This function retrieves the URLs that are associated with the user ID
const urlsforUserid = (id, urlsDB) => {
  const filterID = {};
  for (const itr in urlsDB) {
    const userIDScan = urlsDB[itr];
    if (userIDScan.userID === id) {
      const tempObj = {longURL : userIDScan.longURL, userID : userIDScan.userID};
      filterID[itr] = tempObj;
    }
  } return filterID;
}

// This function generates Hashed password to store in users database
const getHashedPassword = (password) => {
  return bcrypt.hashSync(password,10);
}

module.exports = {generateRandomString, generateUserID, findEmailID, findUserByEmail, authenticator, 
                  urlsforUserid, getHashedPassword, users, urlDatabase };