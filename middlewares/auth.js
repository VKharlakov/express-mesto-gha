const jwt = require('jsonwebtoken')
const Unauthorized = require('../errors/Unauthorized')

module.exports = (req, res, next) => {
  if (!req.cookies) {
    throw new Unauthorized('Не выполнена авторизация');
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'key');
  } catch (err) {
    next(new Unauthorized('Не выполнена авторизация'));
    return
  }

  req.user = payload;

  return next();
}