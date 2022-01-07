const {
  signJWT
} = require('../utils/jwt.util');
const User = require("../models/user.model");

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
    encryptedPassword = await bcrypt.hash(password, 10);

    //Create user in database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    //Create token
    const token = signJWT({
      user_id: user_id,
      email
    }, {
      expiresIn: "2h",
    });

    //save user token
    user.token = token;

    //return new user
    res.status(201).json(user);
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
        user_id: user._id,
        email
      }, {
        expiresIn: "2h",
      });

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  register,
  login
}