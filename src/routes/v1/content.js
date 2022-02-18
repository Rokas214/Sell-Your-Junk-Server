const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('../../middleware');

router.get('/', isLoggedIn, (req, res) => {
  res.send({ msg: 'Home page' });
});

module.exports = router;
