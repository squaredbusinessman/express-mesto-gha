const { InternalErrorCode } = require('../errors/errorsCodes');

module.exports = (err, req, res, next) => {
  const { statusCode = InternalErrorCode, message } = err;
  res.status(statusCode).send({ message: statusCode === InternalErrorCode ? 'Ошибка сервера' : message });
  next();
};
