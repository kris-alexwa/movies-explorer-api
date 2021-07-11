const Movie = require('../models/movie');
const { NotFoundError, ValidationError, ForbiddenError, ConflictError } = require('../errors/errors');

function returnMovies(req, res, next) {
  Movie.findMoviesByOwner(req.user._id)
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
}

function createMovie(req, res, next) {
  const {
    country, director, duration, year,
    description, image, trailer, thumbnail,
    nameRU, nameEN, movieId,
  } = req.body;

  Movie.findMoviesByOwner(req.user._id)
    .then((movies) => {
      if (movies.some((movie) => movie.movieId === movieId)) {
        throw new ConflictError('Данный фильм уже был добавлен в избранное');
      }
    })
    .then(() => {
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
        movieId,
        owner: req.user._id,
      })
        .then((newMovie) => res.send(newMovie))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new ValidationError(`Переданы некорректные данные ${err.message}`);
          }
          throw err;
        })
    })
    .catch((err) => next(err));
}

function deleteMovie(req, res, next) {
  const { id } = req.params;
  Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(`Фильм с указанным id ${id} не найден`);
      }
      if (req.user._id !== movie.owner.toString()) {
        throw new ForbiddenError('Нельзя удалить чужой фильм');
      }
      return movie;
    })
    .then((movie) => movie.remove())
    .then(() => res.send({ message: 'Фильм удален' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError(`Перадан некорректный id ${id}`);
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
