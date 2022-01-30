const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('../../middleware');

router.get('/', isLoggedIn, (req, res) => {});

module.exports = router;
