const http2 = require('node:http2');
const userModel = require('../models/user');

const getUser = (req, res) => {
  userModel.find({}).then((users) => {
    res.send(users);
  })
    .catch(() => {
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Internal Server Error',
      });
    });
};

const getUserbyId = (req, res) => {
  userModel.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Bad Request',
        });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({
          message: 'User with _id cannot be found',
        });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
        });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userModel.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Invalid data to create user',
        });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
        });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  userModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Invalid data to update user',
        });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({
          message: 'User with _id cannot be found',
        });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
        });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  userModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Invalid data to update avatar',
        });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({
          message: 'User with _id cannot be found',
        });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
        });
      }
    });
};

module.exports = {
  getUser,
  getUserbyId,
  createUser,
  updateProfile,
  updateAvatar,
};
