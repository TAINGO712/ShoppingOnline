const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
// utils
const MongooseUtil = require('./utils/MongooseUtil');

// middlewares
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// connect to database
MongooseUtil.connect();

// routes
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});
app.use('/api/admin', require('./api/admin.js'));
// public customer API
app.use('/api/customer', require('./api/customer.js'));



app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));
app.get('admin/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-admin/build', 'index.html'))
});
app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-customer/build', 'index.html'));
});

// start server
app.listen(PORT, () => {
  const msg = `Server listening on ${PORT}`;
  console.log(msg);
  process.stdout.write(msg + '\n');
});