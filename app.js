const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

const loginRouter = require('./routes/users');
const createUserRouter = require('./routes/users');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorsCodes = require('./errors/errorsCodes');
const ApplicationError = require('./errors/ApplicationError');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), loginRouter);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .regex('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=]+$')
      .message('Введите валидный URL-адрес нового аватара'),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
}), createUserRouter);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', () => {
  throw new ApplicationError(errorsCodes.NotFoundError, 'Запрашиваемая страница не существует');
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
});
