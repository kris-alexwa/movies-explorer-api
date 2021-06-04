const jwt = require('jsonwebtoken');
const { ForbiddenError, UnauthorizedError } = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Необходимо авторизоваться');
    }
    const token = authorization.replace('Bearer ', '');
    // верифицируем токен
    let payload;
    try {
      payload = jwt.verify(token, 'secret-key');
    } catch (err) {
      throw new ForbiddenError('Нет доступа');
    }

    req.user = payload;

    next();
  } catch (err) {
    next(err);
  }
};
