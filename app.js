const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/routes');
const { validateCreateUser, validateLoginUser } = require('./middlewares/validate');
const { auth } = require('./middlewares/auth');
const { createUser, loginUser } = require('./controllers/user');

mongoose.connect('mongodb://127.0.0.1/mestodb');

const app = express();

app.use(express.json());

app.post('/signin', validateLoginUser, loginUser);
app.post('/signup', validateCreateUser, createUser);
app.use(auth);
app.use(router);
app.use(errors());

app.use((err, req, res, next) => {
  console.log(err);

  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Internal Server Error'
        : message,
    });
  next();
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
