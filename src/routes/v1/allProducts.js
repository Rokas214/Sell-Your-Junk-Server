const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('../../middleware');
const mysql = require('mysql2/promise');
const { dbConfig } = require('../../config');

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(` 
    SELECT * FROM product
 `);
    await con.end();
    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
});

module.exports = router;
