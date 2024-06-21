const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const errRouter = require('./routes/err');
const homeRouter = require('./routes/home');
const sellRouter = require('./routes/sell');




const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'assets')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: 'cfne34vv89vh939gv389ghnv5v5hn54h9',
    cookie: { maxAge: 600000000000000 },
    saveUninitialized: false,
    resave: false
  })
);

app.use(flash());

//checking for if user is logged in
const checkLoggedIn = function(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    req.flash('error', 'Please log in to access this page.');
    res.redirect('/login');
  }
}


//checking for if user is logged out
const checkLoggedOut = function(req, res, next) {
  if (!req.session.loggedin) {
    next();
  } else {
    req.flash('error', 'You are already logged in.');
    res.redirect('/');
  }
}

app.use('/', indexRouter);
app.use('/login', checkLoggedOut, loginRouter);
app.use('/logout', logoutRouter);
app.use('/err', errRouter);
app.use('/home', homeRouter);
app.use('/sell', checkLoggedIn, sellRouter);

app.use((req, res, next) => {
  res.status(404).redirect('/err')
})

  
const port = 4000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


app.use(checkLoggedIn);

module.exports = app;
