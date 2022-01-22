const express = require("express");
const router = express.Router();
const {
  getProfile,
  changeProfile
} = require('../controllers/profile.controller')

/* GET users profile */
router.get("/profile", getProfile, (err) => {
  console.error(err.message)
  res.status(500).send('Server error')
});

// CHANGE users profile
router.post('/profile', changeProfile);


module.exports = router;