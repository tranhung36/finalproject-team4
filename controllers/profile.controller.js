const Profile = require("../models/user.model");

async function getProfile(req, res) {
  try {
    const id = req.params.id;
    const user = await Profile.find({ _id: id });
    console.log(user);
    res.render("user", {
      user: user,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
}

async function changeProfile (req, res) {
    
}

module.exports = { getProfile, changeProfile };