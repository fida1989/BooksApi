var express = require('express');
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Book = require('./book.model');

var db = 'mongodb://localhost:27017/bookDb'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect(db, { useNewUrlParser: true });

app.get('/books', function (req, res) {
    console.log('Getting All Books');
    Book.find({}).exec(function (err, books) {
        if (err) {
            console.log(err);
            res.send('Error');
        } else {
            console.log(books.length);
            res.json(books);
        }
    });
});

app.get('/books/:id', function (req, res) {
    console.log('Getting Book');
    Book.findOne({
        _id: req.params.id
    }).exec(function (err, book) {
        if (err) {
            console.log(err);
            res.send('Error');
        } else {
            console.log(book._id);
            res.json(book);
        }
    });
});

app.post('/book', function (req, res) {
    var newBook = new Book();
    newBook.title = req.body.title;
    newBook.author = req.body.author;
    newBook.category = req.body.category;
    newBook.save(function (err, book) {
        if (err) {
            console.log(err);
            res.send('Error');
        } else {
            console.log(book._id);
            res.send(book);
        }
    })
});

app.post('/bookObj', function (req, res) {
    Book.create(req.body, function (err, book) {
        if (err) {
            res.send('error saving book');
        } else {
            console.log(book);
            res.send(book);
        }
    });
});

app.put('/book/:id', function (req, res) {
    Book.findOneAndUpdate({
        _id: req.params.id
    },
        {
            $set: { title: req.body.title, author: req.body.author, category: req.body.category }
        }, { upsert: true }, function (err, newBook) {
            if (err) {
                res.send('error updating ');
            } else {
                console.log(newBook);
                res.send(newBook);
            }
        });
});

app.delete('/book/:id', function (req, res) {
    Book.findOneAndRemove({
        _id: req.params.id
    }, function (err, book) {
        if (err) {
            res.send('error removing')
        } else {
            console.log(book);
            res.send(book);
        }
    });
});

app.get('/', function (req, res) {
    res.send('Welcome To BooksApi');
});

app.listen(port, function () {
    console.log('Server Running');
});

