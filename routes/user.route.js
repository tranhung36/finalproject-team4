const express = require("express");
const router = express.Router();
const { getProfile, changeProfile } = require('../controllers/profile.controller')

/* GET users profile */
router.get("/:id", getProfile, (err) => {
  console.error(err.message)
  res.status(500).send('Server error')
});

// CHANGE users profile
router.post('/:id', changeProfile);


module.exports = router;
