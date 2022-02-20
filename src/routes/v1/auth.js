const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { dbConfig } = require('../../config');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const router = express.Router();

const userSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  passwordOne: Joi.string().min(6).max(255).required(),
  passwordTwo: Joi.string().min(6).max(255).required(),
  username: Joi.string().min(1).max(255).required(),
});
const userSchemaLogin = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(6).max(255).required(),
});

router.post('/register', async (req, res) => {
  let userInputs = req.body;

  if (userInputs.passwordOne !== userInputs.passwordTwo) {
    return res.send('Passwords must match!');
  }

  try {
    userInputs = await userSchema.validateAsync(userInputs);
  } catch (err) {
    return res.status(400).send({ err });
  }

  const encryptedPassword = bcrypt.hashSync(userInputs.passwordOne);

  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`
      INSERT INTO users (email,password,username)
      VALUES (${mysql.escape(userInputs.email)}, '${encryptedPassword}', '${
      userInputs.username
    }')`);

    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err });
  }
});

router.post('/login', async (req, res) => {
  let userInputs = req.body;
  try {
    userInputs = await userSchemaLogin.validateAsync(userInputs);
  } catch (err) {
    res.status(400).send({ err: 'Incorrect email or password' });
  }

  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`
      SELECT * FROM users WHERE email = ${mysql.escape(userInputs.email)} 
      `);

    await con.end();
    const validatePassword = bcrypt.compareSync(
      userInputs.password,
      data[0].password,
    );

    const token = jwt.sign(
      {
        email: userInputs.email,
      },
      'rokas123',
    );

    return validatePassword
      ? res.send({ msg: 'Success', token })
      : res.status(400).send('Incorrect email or password');
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: 'Something went wrong' });
  }
});

module.exports = router;
