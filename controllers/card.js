const cardModel = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const getCard = (req, res, next) => {
  cardModel.find({}).then((cards) => {
    res.send(cards);
  })
    .catch(next);
};

const createCard = (req, res, next) => {
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
        next(new BadRequestError('Invalid data to create card'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Not found: Invalid _id');
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        next(new ForbiddenError('Card cannot be deleted'));
      }

      return card.deleteOne()
        .then(() => res.send({
          message: 'Card was deleted',
        }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Card with _id cannot be found'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Not found: Invalid _id');
      }

      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid data to add like'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Not found: Invalid _id');
      }

      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid data to remove like'));
      } else {
        next(err);
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
