require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const errorHandler = require('./middlewares/error');
const routes = require('./routes/index');
const { requestLogDealer, errorLogDealer } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'http://frontend.antropov.mesto.nomoredomains.sbs',
    'http://backend.antropov.mesto.nomoredomains.sbs',
    'https://frontend.antropov.mesto.nomoredomains.sbs',
    'https://backend.antropov.mesto.nomoredomains.sbs',

  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogDealer);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Произошёл краш-тест сервера');
  }, 0);
});

app.use(routes);

app.use(errorLogDealer);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
});
