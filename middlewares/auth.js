const jwt = require('jsonwebtoken');
const ApplicationError = require('../errors/ApplicationError');
const errorsCodes = require('../errors/errorsCodes');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new ApplicationError(errorsCodes.UnAuthorizedError, 'Вы должны быть авторизованы'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'very-hard-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new ApplicationError(errorsCodes.UnAuthorizedError, 'Вы должны быть авторизованы'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
