const { checkToken } = require('../utils/jwtAuth');
const UnauthorizedError = require('../errors/unauthorized-err');

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    next(new UnauthorizedError('User is not logged in'));
    return;
  }

  const token = req.headers.authorization.raplace('Bearer', '');

  try {
    const payload = checkToken(token);

    req.user = payload;

    next();
  } catch (err) {
    next(new UnauthorizedError('User is not logged in'));
  }
};

module.exports = {
  auth,
};
