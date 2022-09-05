const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const errorsCodes = require('./errors/errorsCodes');
const ApplicationError = require('./errors/ApplicationError');
const authorizationRouter = require('./routes/authorization');
const authenticationRouter = require('./routes/authentication');
const errorHandler = require('./middlewares/error');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use('/signup', authorizationRouter);
app.use('/signin', authenticationRouter);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', () => {
  throw new ApplicationError(errorsCodes.NotFoundError, 'Запрашиваемая страница не существует');
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
});
