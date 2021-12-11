const bcrypt = require('bcryptjs');

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
  },
  "userxyz02": {
    id: "userxyz02", 
    email: "hashed@test.com", 
    password: "$2a$10$zQvazZ/vVqf.IrDXEbHIBegl6i1zBcSuqlYadEiG8V4Gi0uy7FPMa"
  }
};


function generateRandomString() {
  return "abcde" + Math.floor(Math.random() * 4);
}

function generateUserID() {
  return "users" + Math.random().toString(36).substr(2,8);
}

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


const findUserByEmail = (email,users) => {
  for (let itr in users) {
    const userDetails = users[itr];
    if (userDetails.email === email) {
      return userDetails.id;
    }
  } return undefined;
}; 

const authenticator = (email,password,users) => {
  for (let itr in users) {
    const userCred = users[itr];
    if (userCred.email === email && bcrypt.compareSync(password,userCred.password)) {
      return true;
    }
  } return false;
};

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

const getHashedPassword = (password) => {
  return bcrypt.hashSync(password,10);
}

module.exports = {generateRandomString, generateUserID, findEmailID, findUserByEmail, authenticator, 
                  urlsforUserid, getHashedPassword, users, urlDatabase };