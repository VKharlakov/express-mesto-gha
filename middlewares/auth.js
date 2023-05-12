const jwt = require('jsonwebtoken')
const Unauthorized = require('../errors/Unauthorized')

module.exports.auth = (req, res, next) => {
  const {authorization} = req.headers

  if(!authorization || !authorization.startsWith('Bearer')) {
    throw new Unauthorized('Не выполнена авторизация')
  }

  const token = authorization.replace('Bearer ', '')
  let payload
  try {
    payload = jwt.verify(token)
  } catch(err) {
    throw new Unauthorized('Не выполнена авторизация')
    return
  }

  req.user = payload

  next()
}