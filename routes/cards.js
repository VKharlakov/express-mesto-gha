// Файл маршрутов '/cards'
const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getCards, createCard, deleteCardById, putLike, removeLike,
} = require('../controllers/cards');

router.get('/', getCards); // Запрос списка карточек

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/https?:\/\/(\www\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i),
  }),
}), createCard); // Создание новой карточки

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteCardById); // Удаление карточки

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), putLike); // Установка лайка

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), removeLike); // Удаление лайка

module.exports = router;
