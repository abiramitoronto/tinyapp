# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

## Main Page ==> http://localhost:8080/urls 

!["Main Page ==> http://localhost:8080/urls"](https://github.com/abiramitoronto/tinyapp/blob/master/MainPage.png)

## Login Page 
!["Login Page"](https://github.com/abiramitoronto/tinyapp/blob/master/LoginPage.png)


## Register Page
!["Registration Page](https://github.com/abiramitoronto/tinyapp/blob/master/RegisterPage.png)


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.


## Instructions for using the TinyApp

- Register your Email ID and Password
- Login using you Email ID and Password
- The Main Page will not show any URLs that are tagged under your Credentials
- Hit Create New URL Link which directs you to add any preferred Long URLs
- Upon submission it will display the short URL
- Go to My URLs page to view the added Long URL and corresponding short URL
- You can also edit/delete the long URL in this page 

## Security Features

- You cannot create short URL without valid login credentials
- The input password is encrypted using bcrypt Hashed Password and stored into Database while registering
- During Login, the input password is converted into bcypt Hashed Password and matched agaist database for   
  authentication.

## Session Cookies

- Random Cookie user ID generated and stored in Session Cookies while the user is logged in.
- During Logout, Session Cookies will be destroy the Cookie user ID for security purpose.

## Helper Functions

generateRandomString - This generates random string which is used for short URLs

```js
function generateRandomString() {
  return "abcde" + Math.floor(Math.random() * 4);
}
```

generateUserID - This generates random Cookie User ID that is stored in the Database.

```js
function generateUserID() {
  return "users" + Math.random().toString(36).substr(2,8);
}
```

findEmailID - This is used to check existance of input Email in the database during registration process

```js
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
```


findUserByEmail - This is user to retrieve the Cookie User from Database based on the input Email

```js
const findUserByEmail = (email,users) => {
  for (let itr in users) {
    const userDetails = users[itr];
    if (userDetails.email === email) {
      return userDetails.id;
    }
  } return undefined;
};
```

authenticator - This is used to check if the input credential that are entered is Valid or not

```js
const authenticator = (email,password,users) => {
  for (let itr in users) {
    const userCred = users[itr];
    if (userCred.email === email && bcrypt.compareSync(password,userCred.password)) {
      return true;
    }
  } return false;
};
```

urlsforUserid - This pulls out the URLs from the Database that belongs to the logged in user

```js
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
```

getHashedPassword - This generates Hashed Password from the input Password using bcrypt to store in the Database

```js
const getHashedPassword = (password) => {
  return bcrypt.hashSync(password,10);
}
```

## Mocha and Chai

- All the Helper funcitons are validated using Mocha and Chai.