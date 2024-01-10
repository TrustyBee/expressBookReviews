const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let validUsers = users.find((user) => {return user.username === username})
    return validUsers.length > 0
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let authUsers = users.filter((user) => {
        return user.username === username && user.password === password
    })
    return authUsers.length > 0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
      return res.status(404).json({message: "Error: Login failed"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
        accessToken,username
  }
  return res.status(200).json({message: "User successfully logged in"});
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let text = req.query.text
  let isbn = req.params.isbn
  let username = req.session.authorization.username
  if(books[isbn]){
    if(!text.length == 0){
        books[isbn].reviews[username] = text
        return res.status(200).json({message: "Review of user " + username + " has been successfully added/modified for Book with ISBN " + isbn + "." })
    }
    return res.status(400).json({message: "No review text provided" + text.length})
  }
  return res.status(400).json({message: "No Book found with ISBN " + isbn + "."})
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn
    let username = req.session.authorization.username
    if(books[isbn]){
        if(books[isbn].reviews[username]){
            delete books[isbn].reviews[username]
            return res.status(200).json({message: "Successfully deleted review for user " + username + " on ISBN " + isbn + "."})
        }
        return res.status(400).json({message: "No review found for user " + username + " on ISBN " + isbn + "."})
      }
      return res.status(400).json({message: "No Book found with ISBN " + isbn + "."})

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
