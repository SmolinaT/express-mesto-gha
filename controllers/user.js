const userModel = require('../models/user');

const getUser = (req, res) => {
  userModel.find({}).then((users) => {
    res.send(users);
  })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const getUserbyId = (req, res) => {
  userModel.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'User with _id cannot be found',
        });
      }
      return res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
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
        res.status(400).send({
          message: 'Invalid data to create user',
        });
      }
      return res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
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
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Invalid data to update user',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'User with _id cannot be found',
        });
      }
      return res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
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
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Invalid data to update avatar',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'User with _id cannot be found',
        });
      }
      return res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

module.exports = {
  getUser,
  getUserbyId,
  createUser,
  updateProfile,
  updateAvatar,
};
