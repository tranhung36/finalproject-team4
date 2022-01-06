const createError = require('http-errors');
const express = require('express');
const morgan = require('morgan')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts')
const db = require('./config/database/db')
const jwt = require('jsonwebtoken');
const auth = require("./middleware/auth.middleware");

const routes = require('./routes');
const { process_params } = require('express/lib/router');
const User = require("./models/user.model");

const app = express();
const port = 8080
require('dotenv').config()

db.connect()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(logger('dev'));
app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', routes);

//register
app.post("/register", async(req, res) => {
  try {
    //get user input
    const { first_name, last_name, email, password } = req.body;
    
    //Validate user input
    if(!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });
    if(oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    //Create user in database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });
    
    //Create token
    const token = jwt.sign(
      { user_id: user_id, email},
      process.env.TOKEN_KEY, 
      {
        expiresIn: "2h",
      }
    );

    //save user token
    user.token = token;

    //return new user
    res.status(201).json(user);

  } catch(err) {
    console.log(err);
  }

});
  
// Login
app.post("/login", async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  
});

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome!");
});

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
})

module.exports = app;