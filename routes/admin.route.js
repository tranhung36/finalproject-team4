const express = require("express");
const router = express.Router();
const {
  renderManageUserPage,
  renderUpdateUserPage,
  renderCreateUserPage,
  deleteUser,
  createUser,
  updateUser,
} = require("../controllers/admin.controller");

router.get("/", renderManageUserPage);
router.get("/manageUsers", renderManageUserPage);

router.get("/manageUsers/createUser", renderCreateUserPage);
router.post("/manageUsers/createUser", createUser);

router.get("/manageUsers/updateUser/:id", renderUpdateUserPage);
router.put("/manageUsers/updateUser/:id", updateUser);

router.get("/manageUsers/deleteUser/:id", deleteUser);

module.exports = router;
