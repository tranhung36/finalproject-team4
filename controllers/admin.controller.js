const User = require("../models/user.model");

async function redenerManageUser(req, res) {
  try {
    let userInfo = await User.find();
    
    res.render("admin/ManageUserPage", {
      userInfo,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
}

module.exports = {
    redenerManageUser,
  };