const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { UnauthorizedError, ValidationError } = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ValidationError('Не передан email или пароль');
    }
    User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        res.send({ token });
      })
      .catch((err) => {
        throw new UnauthorizedError(err.message);
      })
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
};
