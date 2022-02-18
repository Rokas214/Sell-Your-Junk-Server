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
        INSERT INTO product (user_email, image,price,description)
        VALUES('${req.headers.email}', '${req.body.image}', '${req.body.price}', '${req.body.description}')`);
    await con.end();
    return res.send(data);
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .send({ err: 'Incorrect data passed, field must be filled' });
  }
});

// update product
// set price=10, description='hello'
// where id=2

router.post('/update', async (req, res) => {
  let userInputs = req.body;
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`
        UPDATE product
        SET price='${req.body.price}', description='${req.body.description}'
        WHERE id='${req.headers.id}'`);
    await con.end();
    return res.send(data);
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .send({ err: 'Incorrect data passed, field must be filled' });
  }
});

router.get('/', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(` SELECT * FROM product`);
    await con.end();
    return res.send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
});

module.exports = router;
