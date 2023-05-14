// Файл контроллеров для маршрута '/cards'
const Card = require('../models/card');
const SUCCESS_CODES = require('../utils/constants');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

// Обработчик запроса списка карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => { res.status(SUCCESS_CODES.success).send({ data: cards }); })
    .catch(next);
};

// Обработчик создания карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => { res.status(SUCCESS_CODES.created).send({ data: card }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Неверный формат введенных данных'));
      } else {
        next(err);
      }
    });
};

// Обработчик удаления карточки
module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => { throw new NotFound('Такой фотографии не существует'); })
    .then((card) => {
      const isOwner = req.user._id === card.owner.toString();
      if (isOwner) {
        return Card.deleteOne(card)
          .then(() => { res.status(SUCCESS_CODES.success).send({ data: card }); });
      } throw new Forbidden('Только автор фотографии может ее удалить');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неверный формат введенных данных'));
      } else {
        next(err);
      }
    });
};

// Обработчик установки лайка на карточку
module.exports.putLike = (req, res, next) => {
  // eslint-disable-next-line max-len
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true, runValidators: true })
    .orFail(() => { throw new NotFound('Такой фотографии не существует'); })
    .then((card) => { res.status(SUCCESS_CODES.success).send({ data: card }); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неверный формат введенных данных'));
      } else {
        next(err);
      }
    });
};

// Обработчик удаления лайка с карточки
module.exports.removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => { throw new NotFound('Такой фотографии не существует'); })
    .then((card) => { res.status(SUCCESS_CODES.success).send({ data: card }); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неверный формат введенных данных'));
      } else {
        next(err);
      }
    });
};
