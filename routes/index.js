var express = require('express');
var router = express.Router();
var loki = require('lokijs');

var db = new loki('data.json', {
  autoload: true,
  autoloadCallback: databaseInitialize,
  autosave: true,
  autosaveInterval: 4000
});

function databaseInitialize() {
  var users = db.getCollection("Users");
  if (users === null) {
    users = db.addCollection("Users");
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Login */
router.post('/login', function (req, res) {

  var whereClause = {};

  if (req.body.username) whereClause.username = req.body.username;
  if (req.body.password) whereClause.password = req.body.password;

  let result = db.getCollection("Users").find(whereClause);

  if (result.length != 0) {

    // if you are root user, then present all users
    if (result[0].username == "Root") {
      var results = db.getCollection("Users").find();
      res.render('users', {users: results});
    } else {
      res.render('user', {user: result[0]});
    }

  } else {
    res.status(404).send('Unable to find the user');
  }
});

/* Display a single User */
router.get('/base/:base', function (req, res) {
  
  console.log(req.params.base);

  let result = db.getCollection("Users").findOne({ base: req.params.base });

  if (result) {
    // if you are root user, then present all users
    if (result.username == "Root") {
      var results = db.getCollection("Users").find();
      res.render('users', {users: results});
    } else {
      res.render('moreinfo', {user: result});
    }
  } else {
    res.send('Wrong url!');
  }
});

/* Display all Users */
router.get('/users', function (req, res) {

  var result = db.getCollection("Users").find();

  res.render('users', {users: result});
});

module.exports = router;
