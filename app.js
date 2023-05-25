const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/routes');

mongoose.connect('mongodb://127.0.0.1/mestodb');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '646cc073e75858b0cba8f293',
  };

  next();
});

app.use(router);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
