const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  NotFoundError, ValidationError, ConflictError, UnauthorizedError,
} = require('../errors/errors');

function createUser(req, res, next) {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => res.send({
      id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      if (err.name === 'ValidationError') {
        throw new ValidationError(`Переданы некорректные данные ${err.message}`);
      }
      throw err;
    })
    .catch((err) => next(err));
}

function returnUserInfo(req, res, next) {
  const myId = req.user?._id;
  if (!myId) {
    throw new UnauthorizedError('Пользователь не залогинен');
  }
  User.findById(myId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с указанным id ${req.params.id} не найден`);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError(`Перадан некорректный id ${req.params.id}`);
      }
      throw err;
    })
    .catch((err) => next(err));
}

function updateUserInfo(req, res, next) {
  User.findByIdAndUpdate(
    req.user._id, { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с id ${req.user._id} не найден`);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      if (err.name === 'ValidationError') {
        throw new ValidationError(`Переданы некорректные данные ${err.message}`);
      }
      throw err;
    })
    .catch((err) => next(err));
}

module.exports = {
  returnUserInfo,
  updateUserInfo,
  createUser,
};
