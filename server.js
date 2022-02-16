const cors = require('cors');
const express = require('express');

const auth = require('./src/routes/v1/auth');
const content = require('./src/routes/v1/content');
const addProduct = require('./src/routes/v1/addProduct');
const allProducts = require('./src/routes/v1/allProducts');

const app = express();
app.use(express.json());
app.use(cors());

const { port } = require('./src/config');

app.use('/v1/auth', auth);
app.use('/v1/content', content);
app.use('/v1/add', addProduct);
app.use('/v1/products', allProducts);

app.all('*', (req, res) => {
  res.status(400).send({ err: 'Page not found' });
});

app.listen(port, () => console.log(`Server is working on port: ${port}`));
