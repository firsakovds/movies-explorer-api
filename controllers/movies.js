const mongoose = require("mongoose");
const Movie = require("../models/movie");
const BadRequestError = require('../errors/BadRequestError');
const UserNotFound = require('../errors/UserNotFound');
const HttpForbiddenError = require('../errors/HttpForbiddenError')

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id
  return Movie.find({ owner })
    .then((movie) => {
      return res.status(200).send(movie);
    })
    .catch((err) => {
      next(err)
    });
};

module.exports.createMovies = (req, res, next) => {
  const { country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN } = req.body;
  const owner = req.user._id;

  return Movie.create({ country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN, owner })
    .then((movie) => {
      return res.status(201).send(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Ошибка валидации'))
      } else {
        next(err)
      }
    });
};

module.exports.deleteMovies = (req, res, next) => {
  const { _id } = req.params;

  Movie.findById(_id)
    .then((movie) => {
      if (!movie) {
        throw new UserNotFound('Карточка не найдена')
      } if (JSON.stringify(movie.owner) !== JSON.stringify(req.user._id)) {
        throw new HttpForbiddenError('Карточка не ваша')
      } else {
        return Movie.findByIdAndDelete(_id)
      }
    })
    .then(() => {
      return res.status(200).send({ message: 'Карточка удалена' })
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Неверный id'))
      } else {
        next(err)
      }
    });
};
