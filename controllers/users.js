// Файл контроллеров для маршрута '/users'
const NotFound = require('../errors/errors');
const RESPONSE_CODE = require('../errors/responseCodes');
const User = require('../models/user');

// Обработчик запроса списка пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => { res.status(RESPONSE_CODE.success).send({ data: users }); })
    .catch(() => { res.status(RESPONSE_CODE.serverError).send({ message: 'Произошла ошибка 500' }); });
};

// Обработчик запроса пользователя по _id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => { throw new NotFound(); })
    .then((user) => { res.status(RESPONSE_CODE.success).send({ data: user }); })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(RESPONSE_CODE.notFoundError).send({ message: 'Ошибка: такого пользователя не существует' });
      } else if (err.name === 'CastError') {
        res.status(RESPONSE_CODE.dataError).send({ message: 'Ошибка неправильных данных' });
      } else {
        res.status(RESPONSE_CODE.serverError).send({ message: 'Произошла ошибка 500' });
      }
    });
};

// Обработчик создания пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => { res.status(RESPONSE_CODE.created).send({ data: user }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(RESPONSE_CODE.dataError).send({ message: 'Ошибка неправильных данных' });
      } else {
        res.status(RESPONSE_CODE.serverError).send({ message: 'Произошла ошибка 500' });
      }
    });
};

// Обработчик обновления информации о пользователе
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => { throw new NotFound(); })
    .then((user) => { res.status(RESPONSE_CODE.success).send({ data: user }); })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(RESPONSE_CODE.notFoundError).send({ message: 'Ошибка: такого пользователя не существует' });
      } else if (err.name === 'ValidationError') {
        res.status(RESPONSE_CODE.dataError).send({ message: 'Ошибка неправильных данных' });
      } else {
        res.status(RESPONSE_CODE.serverError).send({ message: 'Произошла ошибка 500' });
      }
    });
};

// Обработчик обновления аватара пользователя
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => { throw new NotFound(); })
    .then((user) => { res.status(RESPONSE_CODE.success).send({ data: user }); })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(RESPONSE_CODE.notFoundError).send({ message: 'Ошибка: такого пользователя не существует' });
      } else if (err.name === 'ValidationError') {
        res.status(RESPONSE_CODE.dataError).send({ message: 'Ошибка неправильных данных' });
      } else {
        res.status(RESPONSE_CODE.serverError).send({ message: 'Произошла ошибка 500' });
      }
    });
};
