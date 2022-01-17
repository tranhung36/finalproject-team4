const express = require("express");
const router = express.Router();
const { redenerManageUser } = require("../controllers/admin.controller");

router.get("/", redenerManageUser);

module.exports = router;
