// Файл маршрутов '/users'

const router = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers); // Запрос списка пользователей
router.get('/:userId', getUserById); // Запрос пользователя по _id
router.post('/', createUser); // Создание пользователя
router.patch('/me', updateUserInfo); // Обновление информации пользователя
router.patch('/me/avatar', updateUserAvatar); // Обновление аватара пользователя

module.exports = router;
