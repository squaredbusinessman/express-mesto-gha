const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const { PORT = 3000 } = process.env;

const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.user = {
    _id: '6305e7cc9b6e4eceb94ec3bb',
  };

  next();
});

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Данной страницы - не существует!' });
});

app.use('/', usersRouter);
app.use('/', cardsRouter);


app.listen(PORT, () => {
});
