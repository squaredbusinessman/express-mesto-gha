const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');

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
app.post('/signup', createUserRouter);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', (req, res) => {
  res.status(errorsCodes.UnAuthorizedError).send({ message: 'Произошла ошибка при попытке авторизации' });
});

app.listen(PORT, () => {
});
