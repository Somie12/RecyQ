const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const crypto = require('crypto');

const dbConfig = {
  host: '13.232.203.27	',
  user: 'admin',
  password: 'renewretech',
  database: "auth"
};

const connection = mysql.createConnection(dbConfig);

//function to check if user is logged in and store username in session
function requireLogin(req, res, next) {
  if (req.session.loggedin && req.session.username) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/', function(req, res, next) {
  res.render('login', { message: req.flash('error'), username: req.body.username });
});

router.post('/', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  console.log(username);

  if (username && password) {
    connection.query(
      'SELECT * FROM user_data WHERE BINARY username = ?',
      [username],
      function(error, results, fields) {
        if (error) {
          console.error('Error executing query:', error);
          req.flash('error', 'An error occurred while trying to log in.');
          res.redirect('/login');
          return;
        }

        if (results.length > 0) {
          var user = results[0];
          var asciiSum = 0;
          for (var i = 0; i < password.length; i++) {
            asciiSum += password.charCodeAt(i);
          }
          asciiSum += 10;
          var hash = crypto.createHash('sha256').update(asciiSum.toString()).digest('hex');
          if (hash === user.password) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/');
          } else {
            req.flash('error', 'Wrong password!');
            res.redirect('/login');
          }
        } else {
          req.flash('error', 'User does not exist!');
          res.redirect('/login');
        }
      }
    );
  } else {
    res.redirect('/login');
  }
});

// accessing user name from session
router.post('/', requireLogin, function(req, res, next) {
  var username = req.body.username;
  // Use the username as needed
  if (username)
    res.render('/', { username: username });
});

// logout route
router.get('/logout', function(req, res, next) {
  // Destroy the session
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;