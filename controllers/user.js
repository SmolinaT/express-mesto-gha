const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const { signToken } = require('../utils/jwtAuth');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const MONGO_DUPLICATE_KEY_ERROR = 11000;
const SALT_ROUNDS = 10;

const getUser = (req, res, next) => {
  userModel.find({}).then((users) => {
    res.send(users);
  })
    .catch(next);
};

const getUserMe = (req, res, next) => {
  userModel.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.send(user);
    })
    .catch(next);
};

const getUserbyId = (req, res, next) => {
  userModel.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Bad Request'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('User with _id cannot be found'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      console.log(hash);

      userModel.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then(() => {
          res.status(201).send({
            name,
            about,
            avatar,
            email,
          });
        })
        .catch((err) => {
          if (err.name === MONGO_DUPLICATE_KEY_ERROR || err.code === 11000) {
            next(new ConflictError('Such a user already exists'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError('Invalid data to create user'));
          } else {
            next(err);
          }
        });
    });
};

const updateProfile = (req, res, next) => {
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
        next(new BadRequestError('Invalid data to update user'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('User with _id cannot be found'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
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
        next(new BadRequestError('Invalid data to update avatar'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('User with _id cannot be found'));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findOne({ email }).select('+password')
    .orFail(() => {
      throw new UnauthorizedError('Email or password is incorrect');
    })
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, isEqual]) => {
      if (!isEqual) {
        throw new UnauthorizedError('Email or password is incorrect');
      }

      const token = signToken({ _id: user._id });

      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports = {
  getUser,
  getUserMe,
  getUserbyId,
  createUser,
  updateProfile,
  updateAvatar,
  loginUser,
};
