const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('../../middleware');
const mysql = require('mysql2/promise');
const { dbConfig } = require('../../config');

router.post('/', async (req, res) => {
  let userInputs = req.body;
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`
        INSERT INTO products (user_email, price)
        VALUES(${mysql.escape(req.headers.email)}, '${req.body.price}')`);
    await con.end();
    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
});

router.get('/', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(` SELECT * FROM products`);
    await con.end();
    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
});

module.exports = router;
