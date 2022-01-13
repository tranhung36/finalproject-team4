const Profile = require("../models/user.model");

async function getProfile(req, res) {
  try {
    const id = req.params.id;
    const user = await Profile.findOne({
      _id: id
    });
    // console.log({user});
    const abc = {
      name: "asdfasf",
      age: 18
    }
    res.render("user", {
      user: user,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
}

async function changeProfile(req, res) {
  try {
    const id = req.params.id;
    const user = await Profile.findOne({
      _id: id
    });
    // console.log({user});
    const abc = {
      name: "asdfasf",
      age: 18
    }
    res.render("user", {
      user: user,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
}

module.exports = {
  getProfile,
  changeProfile
};