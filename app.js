const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate')
const { login, createUser } = require('./controllers/users')
const { auth } = require('./middlewares/auth');
const NotFound = require('./errors/NotFound');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1/mestodb')
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((err) => console.error('Ошибка подключения:', err));

app.post('/signin', celebrate({
  headers: Joi.object({
    cookie: Joi.string().required().regex(/jwt=[\w.]/),
  }).unknown(true),
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }).unknown(true)
}), login);

app.post('/signup', celebrate({
  headers: Joi.object({
    cookie: Joi.string().required().regex(/jwt=[\w.]/),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(\www\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }).unknown(true)
}), createUser);

app.use(auth)

app.use('/', require('./routes/index'));

app.use('*', () => {
  throw new NotFound('Такой страницы не существует');
});

app.use(errors())
app.use((err, req, res, next) => {
  if(err.statusCode) {
    res.status(err.statusCode).send({message: err.message})
  } else {
    res.status(500).send({message: 'Произошла ошибка на сервере'})
  }

  next()
})

app.listen(PORT, () => {
  console.log(`App's listening on port ${PORT}`);
});
