const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
let MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const app = express();

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(`Mongo Error: ${err}`));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
      url: process.env.MONGODB_URI,
      mongooseConnection: mongoose.connection,
      autoReconnect: true
  }),
  cookie: {
      secure: false,
      maxAge: 6000000
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(passport.initialize())
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.errors = req.flash('errorMessage');
  res.locals.regErrors = req.flash('RegErrorMessage');
  res.locals.success = req.flash('successMessage');
  next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.get('/', (req, res) => {
  return res.render('main/index');
});

module.exports = app;
