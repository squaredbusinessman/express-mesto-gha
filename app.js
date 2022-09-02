const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const { celebrate, Joi, errors } = require('celebrate');

const { PORT = 3000 } = process.env;

const app = express();

const loginRouter = require('./routes/users');
const createUserRouter = require('./routes/users');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorsCodes = require('./errors/errorsCodes');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.post('/signin', loginRouter);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .regex(/https?:\/\/(www)?(\.)?([0-9а-яa-zё]{1,})?(\.)?([0-9а-яa-zё]{1,})?(\.)?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2,4}[a-zа-яё\-._~:/?#[\]@!$&'()*+,;=]*#?/i),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  })
}), createUserRouter);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', (req, res) => {
  res.status(errorsCodes.UnAuthorizedError).send({ message: 'Произошла ошибка при попытке авторизации' });
});

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(PORT, () => {
});
