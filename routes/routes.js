const router = require('express').Router();
const http2 = require('node:http2');
const userRouter = require('./user');
const cardRouter = require('./card');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/*', (req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND)
    .send({
      message: '404: Not Found',
    });
});

module.exports = router;
