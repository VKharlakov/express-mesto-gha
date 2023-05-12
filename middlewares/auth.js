const jwt = require('jsonwebtoken')
const Unauthorized = require('../errors/Unauthorized')

module.exports = (req, res, next) => {
  if (!req.cookies) {
    throw new Unauthorized('Не выполнена авторизация');
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token);
  } catch (err) {
    return next(new Unauthorized('Не выполнена авторизация'));
  }

  req.user = payload;

  return next();
}