const Profile = require("../models/user.model");

async function getProfile(req, res) {
  try {
    const id = req.params.id;
    const user = await Profile.findOne({ _id: id });
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
    try {
        //get change input
        const {
            firstName,
            lastName
        } = req.body;

        //filter
        const id = req.params.id;
        const filter = {_id: id}
        //change
        const update = {first_name: firstName, last_name: lastName}
        console.log(req.body);
        //update
        await Profile.findOneAndUpdate( filter, update, {new: true});
        
      } catch (err) {
        return res.json({
          msg: err.message,
        });
      }
}

module.exports = { getProfile, changeProfile };