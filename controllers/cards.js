//Файл контроллеров для маршрута '/cards'
const NotFound = require('../errors/errors')
const Card = require('../models/card')

//Обработчик запроса списка карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => { res.status(200).send({ data: cards }) })
    .catch(() => { res.status(500).send({ message: 'Произошла ошибка 500' }) })
}

//Обработчик создания карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body

  Card.create({ name, link, owner: req.user._id })
    .then((card) => { res.status(201).res.send({ data: card }) })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка неправильных данных' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка 500' })
      }
    })
}

//Обработчик удаления карточки
module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => { throw new NotFound })
    .then((card) => { res.status(200).send({ data: card }) })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: 'Ошибка: такой карточки не существует' })
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка неправильных данных' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка 500' })
      }
    })
}

//Обработчик установки лайка на карточку
module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => { throw new NotFound })
    .then((card) => { res.status(200).send({ data: card }) })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: 'Ошибка: такой карточки не существует' })
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка неправильных данных' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка 500' })
      }
    })
}

//Обработчик удаления лайка с карточки
module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => { throw new NotFound })
    .then((card) => { res.status(200).send({ data: card }) })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: 'Ошибка: такой карточки не существует' })
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка неправильных данных' })
      } else {
        res.status(500).send({ message: 'Произошла ошибка 500' })
      }
    })
}