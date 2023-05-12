// Файл контроллеров для маршрута '/users'
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user');
const SUCCESS_CODES = require('../utils/constants')
const BadRequest = require('../errors/BadRequest')
const NotFound = require('../errors/NotFound')
const Conflict = require('../errors/Conflict')

// Обработчик запроса списка пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => { res.status(SUCCESS_CODES.success).send({ data: users }); })
    .catch((next));
};

// Обработчик запроса пользователя по _id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => { throw new NotFound('Такой пользователь не найден'); })
    .then((user) => { res.status(SUCCESS_CODES.success).send({ data: user }); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неверный формат пользовательского id'))
      } else {
        next(err)
      }
    });
};

// Обработчик создания пользователя
module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
     return User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
      })
    })
    .then((user) => {
      res.status(SUCCESS_CODES.created).send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      })
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Такой email уже зарегистрирован'))
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Неверный формат введенных данных'))
      } else {
        next(err)
      }
    })
};

// Обработчик обновления информации о пользователе
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => { throw new NotFound('Такой пользователь не найден'); })
    .then((user) => { res.status(SUCCESS_CODES.success).send({ data: user }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Неверный формат введенных данных'))
      } else {
        next(err)
      }
    });
};

// Обработчик обновления аватара пользователя
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => { throw new NotFound('Такой пользователь не найден'); })
    .then((user) => { res.status(SUCCESS_CODES.success).send({ data: user }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Неверный формат введенных данных'))
      } else {
        next(err)
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id })

      res.send({ token })
    })
    .catch(next)
}

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id

  User.findById(userId)
    .orFail(() => { throw new NotFound('Такой пользователь не найден') })
    .then((user) => { res.status(SUCCESS_CODES.success).send({ data: user }); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неверный формат пользовательского id'))
      } else {
        next(err)
      }
    })
}