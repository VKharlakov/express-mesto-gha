//Файл маршрутов '/cards'

const router = require('express').Router()
const {getCards, createCard, deleteCardById, putLike, removeLike} = require('../controllers/cards')

router.get('/', getCards)                         //Запрос списка карточек
router.post('/', createCard)                      //Создание новой карточки
router.delete('/:cardId', deleteCardById)         //Удаление карточки
router.put('/:cardId/likes', putLike)             //Установка лайка
router.delete('/:cardId/likes', removeLike)       //Удаление лайка

module.exports = router