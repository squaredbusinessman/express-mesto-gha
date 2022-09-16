const winston = require('winston'); // модуль библиотеки логгера
const expressWinston = require('express-winston'); // модуль библиотеки дружбы логгера и экспресса

// логгируем все запросы
const requestLogDealer = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'requests.log' }),
  ],
  format: winston.format.json(),
})

// логгируем все ошибки
const errorLogDealer = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'errors.log' }),
  ],
  format: winston.format.json(),
})

module.exports = {
  requestLogDealer,
  errorLogDealer,
}
