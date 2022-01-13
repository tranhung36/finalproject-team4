const {
  signJWT
} = require('../utils/jwt.util');
const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const jsdom = require("jsdom");

async function register(req, res) {
  try {
    //get user input
    const {
      first_name,
      last_name,
      email,
      password
    } = req.body;

    //Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({
      email
    });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    //Create user in database
    const user = await User.create({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    if (user) {
      return res.status(201).redirect('/login')
    }
    res.status(400).redirect('/register')
  } catch (err) {
    console.log(err);
  }
}

async function login(req, res) {
  // Our login logic starts here
  try {
    // Get user input
    const {
      email,
      password
    } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({
      email
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = signJWT({
        user_id: user._id
      }, {
        expiresIn: "1h",
      });
      // user
      res.cookie('access_token', token, {
        maxAge: 3600 * 1000,
        httpOnly: true,
        secure: true
      })
        .redirect('/')
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
}

function logout(req, res, next) {
  res.clearCookie('access_token').redirect('/login')
}

module.exports = {
  register,
  login,
  logout
}