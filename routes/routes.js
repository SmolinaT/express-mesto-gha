const router = require('express').Router();
const userRouter = require('./user');
const cardRouter = require('./card');
const { validateCreateUser, validateLoginUser } = require('../middlewares/validate');
const { auth } = require('../middlewares/auth');
const { createUser, loginUser } = require('../controllers/user');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', validateLoginUser, loginUser);
router.post('/signup', validateCreateUser, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('This page does not exist'));
});

module.exports = router;
