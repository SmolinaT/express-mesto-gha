const { checkToken } = require('../utils/jwtAuth');
const UnauthorizedError = require('../errors/unauthorized-err');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('User is not logged in'));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    payload = checkToken(token);

    req.user = payload;
  } catch (err) {
    next(new UnauthorizedError('User is not logged in'));
  }

  return next();
};

module.exports = {
  auth,
};
