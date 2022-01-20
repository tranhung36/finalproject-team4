const User = require("../models/user.model");
const bcrypt = require("bcrypt");

async function renderManageUserPage(req, res) {
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
async function renderCreateUserPage(req, res) {
  res.render("admin/createUserPage");
  ``;
}
async function createUser(req, res) {
  try {
    let email = req.body.email;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let password = req.body.password;
    let role = req.body.role;

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      first_name: firstname,
      last_name: lastname,
      email: email,
      password: encryptedPassword,
      role:role,
    });
    await user.save();
    res.redirect("/admin/manageUsers");
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
}
async function renderUpdateUserPage(req, res) {
  try {
    let id = req.params.id;
    const user = await User.findById({
      _id: id,
    });
    //res.json(user)
    res.render("admin/updateUserPage", { user });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
}
async function updateUser(req, res) {
  try {
    let id = req.params.id;
    let role = req.body.role;

    await User.findOneAndUpdate(
      {
        _id: id
      },
      {
        role:role
      }
    );
    res.redirect("/admin/manageUsers");
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
}
async function deleteUser(req, res) {
  try {
    let id = req.params.id;
    await User.findByIdAndDelete({
      _id: id,
    });
    res.redirect("/admin/manageUsers");
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
}

module.exports = {
  renderManageUserPage,
  renderUpdateUserPage,
  renderCreateUserPage,
  deleteUser,
  createUser,
  updateUser,
};
