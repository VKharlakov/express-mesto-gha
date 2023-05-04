// Файл контроллеров для маршрута '/cards'
const NotFound = require('../errors/errors');
const RESPONSE_CODE = require('../errors/responseCodes');
const Card = require('../models/card');

// Обработчик запроса списка карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => { res.status(RESPONSE_CODE.success).send({ data: cards }); })
    .catch(() => { res.status(RESPONSE_CODE.serverError).send({ message: 'Произошла ошибка 500' }); });
};

// Обработчик создания карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => { res.status(RESPONSE_CODE.created).send({ data: card }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(RESPONSE_CODE.dataError).send({ message: 'Ошибка неправильных данных' });
      } else {
        res.status(RESPONSE_CODE.serverError).send({ message: 'Произошла ошибка 500' });
      }
    });
};

// Обработчик удаления карточки
module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => { throw new NotFound(); })
    .then((card) => { res.status(RESPONSE_CODE.success).send({ data: card }); })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(RESPONSE_CODE.notFoundError).send({ message: 'Ошибка: такой карточки не существует' });
      } else if (err.name === 'CastError') {
        res.status(RESPONSE_CODE.dataError).send({ message: 'Ошибка неправильных данных' });
      } else {
        res.status(RESPONSE_CODE.serverError).send({ message: 'Произошла ошибка 500' });
      }
    });
};

// Обработчик установки лайка на карточку
module.exports.putLike = (req, res) => {
  // eslint-disable-next-line max-len
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true, runValidators: true })
    .orFail(() => { throw new NotFound(); })
    .then((card) => { res.status(RESPONSE_CODE.success).send({ data: card }); })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(RESPONSE_CODE.notFoundError).send({ message: 'Ошибка: такой карточки не существует' });
      } else if (err.name === 'CastError') {
        res.status(RESPONSE_CODE.dataError).send({ message: 'Ошибка неправильных данных' });
      } else {
        res.status(RESPONSE_CODE.serverError).send({ message: 'Произошла ошибка 500' });
      }
    });
};

// Обработчик удаления лайка с карточки
module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => { throw new NotFound(); })
    .then((card) => { res.status(RESPONSE_CODE.success).send({ data: card }); })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(RESPONSE_CODE.notFoundError).send({ message: 'Ошибка: такой карточки не существует' });
      } else if (err.name === 'CastError') {
        res.status(RESPONSE_CODE.dataError).send({ message: 'Ошибка неправильных данных' });
      } else {
        res.status(RESPONSE_CODE.serverError).send({ message: 'Произошла ошибка 500' });
      }
    });
};
