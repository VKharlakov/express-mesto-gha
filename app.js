const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { PORT = 3000 } = process.env

const app = express()
app.use(bodyParser.json())

//Мидлвэр
app.use((req, res, next) => {
  req.user = {
    _id: '644bd5e45b33b2b947ec17c9' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1/mestodb')
.then(() => console.log('Успешное подключение к MongoDB'))
.catch((err) => console.error('Ошибка подключения:', err))

app.use('/users', require('./routes/users'))
app.use('/cards', require('./routes/cards'))
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
  console.log(`App's listening on port ${PORT}`)
})