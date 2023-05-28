const http2 = require('node:http2');
const cardModel = require('../models/card');

const getCard = (req, res) => {
  cardModel.find({}).then((cards) => {
    res.send(cards);
  })
    .catch((err) => {
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  cardModel
    .create({
      owner: req.user._id,
      name,
      link,
    })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Invalid data to create card',
        });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({
          message: 'Not found: Invalid _id',
        });
      }

      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({
            message: 'Card with _id cannot be found',
          });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
        });
      }
    });
};

const likeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({
          message: 'Not found: Invalid _id',
        });
      }

      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Invalid data to add like',
        });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
        });
      }
    });
};

const dislikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({
          message: 'Not found: Invalid _id',
        });
      }

      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Invalid data to remove like',
        });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Internal Server Error',
        });
      }
    });
};

module.exports = {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
