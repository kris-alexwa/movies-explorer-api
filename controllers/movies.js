const Movie = require('../models/movie');
const { NotFoundError, ValidationError, ForbiddenError } = require('../errors/errors');

function returnMovies(req, res, next) {
  Movie.findMoviesByOwner(req.user._id)
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
}

function createMovie(req, res, next) {
  const {
    country, director, duration, year,
    description, image, trailer, thumbnail,
    nameRU, nameEN,
  } = req.body;
  console.log();
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((newMovie) => res.send({ ...newMovie.toObject(), movieId: newMovie._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(`Переданы некорректные данные ${err.message}`);
      }
      throw err;
    })
    .catch((err) => next(err));
}

function deleteMovie(req, res, next) {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(`Фильм с указанным id ${req.params.movieId} не найден`);
      }
      if (req.user._id !== movie.owner.toString()) {
        throw new ForbiddenError('Нельзя удалить чужой фильм');
      }
    })
    .then(() => Movie.findByIdAndRemove(req.params.movieId))
    .then(() => res.send({ message: 'Фильм удален' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError(`Перадан некорректный id ${req.params.cardId}`);
      }
      throw err;
    })
    .catch((err) => next(err));
}

module.exports = {
  returnMovies,
  createMovie,
  deleteMovie,
};
