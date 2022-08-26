const User = require('../models/user');

// 200 - success
// 201 - success, resource created
// 401 - not authorized
// 403 - authorized, but bo access
// 500 - server error
// 400 - not valid data in req
// 422 - unprocessable entity
// 404 - not found





const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Произошла ошибка валидации при создании пользователя - ${err}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка - ${err}, при попытке создать пользователя!` });
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка при получении данных пользователя - ${err}` }));
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка при получении данных пользователей - ${err}` }));
};

const updateUserInfo = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }).orFail(() => {
    const error = new Error();
    error.statusCode = 404;
    throw error;
  }).then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.send({ message: 'Данные обновлённого профиля - некорректны.' });
      } else if (err.statusCode === 404) {
        res.send({ message: 'Пользователя с данным id не существует!' });
      } else {
        res.send({ message: `Произошла ошибка ${err}.` });
      }
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  })
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.send({ message: 'Данные обновлённого аватара - некорректны.' });
      } else if (err.statusCode === 404) {
        res.send({ message: 'Пользователя с данным id не существует!' });
      } else {
        res.send({ message: `Произошла ошибка ${err}.` });
      }
    });
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  updateAvatar,
  updateUserInfo,
};
