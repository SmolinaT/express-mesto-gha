const router = require('express').Router();
const userRouter = require('./user');
const cardRouter = require('./card');
const NotFoundError = require('../errors/not-found-err');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('This page does not exist'));
});

module.exports = router;
