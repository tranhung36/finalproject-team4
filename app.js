const createError = require('http-errors');
const express = require('express');
//const morgan = require('morgan')
const path = require('path');
const cookieParser = require('cookie-parser');
//const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts')
const db = require('./config/database/db')
const fileupload = require('express-fileupload');
const methodOverride = require('method-override')

const routes = require('./routes');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 8080

db.connect()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(fileupload());
app.use(methodOverride('_method'));
// app.use(logger('dev'));
// app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});

module.exports = app;
