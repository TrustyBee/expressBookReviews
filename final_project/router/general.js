const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let identicalusers = users.filter((user)=>{
      return user.username === username
    });

    if(identicalusers.length > 0){
        return true;
    }else{
        return false;
    }
  }

public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if(username && password){
    if(!doesExist(username)){
        users.push({"username":username, "password":password})
        return res.status(200).json({message: "User registration successful"})
    }else{
        return res.status(400).json({message: "User " + username + " already exists."})
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let getBooks = new Promise((resolve, reject) =>{
    setTimeout(() => {
        resolve(books)
    }, 1000)
  })

  getBooks
  .then((books) => {
    return res.status(200).json(books) 
  })
  .catch((error) => {
    return res.status(500).json({message: "Failed to retrieve book list."})  
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn
    let getBookDetails = new Promise((resolve, reject) => {
        if(books[isbn]){
            resolve(books[isbn])
        }
        reject({message: "No book found with isbn " + isbn + "."})
    })

    getBookDetails
    .then((bookDetails) => {
        return res.status(200).json(bookDetails) 
    })
    .catch((error) => {
        return res.status(404).json(error)  
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author
  let getBooksByAuthor = new Promise((resolve, reject) => {
    let filteredBooks = Object.values(books).filter(book => book.author === author);
    if(!(filteredBooks.length === 0)){
        resolve(filteredBooks);
    }
    reject({message: "No books found with author " + author + "."})
  })

  getBooksByAuthor
  .then((books) => {
    return res.status(200).json(books) 
  })
  .catch((error) => {
    return res.status(404).json(error)  
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title

    let getBooksByTitle = new Promise((resolve, reject) => {
    let filteredBooks = Object.values(books).filter(book => book.title === title);
    if(!(filteredBooks.length === 0)){
        resolve(filteredBooks);
    }
    reject({message: "No books found with title " + title + "."})
  })

  getBooksByTitle
  .then((books) => {
    return res.status(200).json(books) 
  })
  .catch((error) => {
    return res.status(404).json(error)  
  })
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn
  if(books[isbn]){
    return res.json({reviews: books[isbn].reviews});
  }
  return res.status(400).json({message: "No Books found with isbn name " + isbn + "."})
});

module.exports.general = public_users;
