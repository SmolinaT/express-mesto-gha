const centralizedError = (err, req, res, next) => {
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
};

module.exports = centralizedError;
