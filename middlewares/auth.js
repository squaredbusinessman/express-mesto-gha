const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Вы должны быть авторизованы' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(
      token,
      'very-hard-key'
    );
  } catch (err) {
    // отправим ошибку, если не получилось
    return res.status(401).send({ message: 'Вы должны быть авторизованы' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
}
