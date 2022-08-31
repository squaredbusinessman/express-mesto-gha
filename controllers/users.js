const User = require('../models/user');
const UserNotFound = require('../errors/UserNotFound');
const IncorrectDataSent = require('../errors/IncorrectDataSent');
const ApplicationError = require('../errors/ApplicationError');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: new ApplicationError().message });
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new UserNotFound();
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Указаны некорректные данные при запросе пользователя' });
      } else if (err.name === 'UserNotFound') {
        res.status(404).send({ message: 'Пользователь с данным id не найден' });
      } else {
        res.status(500).send({ message: new ApplicationError().message });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(500).send({ message: new ApplicationError().message });
    });
};

const updateUserInfo = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }, {
    runValidators: true,
    new: true,
  }).orFail(() => {
    const error = new IncorrectDataSent('обновления информации пользователя');
    error.statusCode = 404;
    throw error;
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Данные для обновления пользователя - некорректны' });
      } else if (err.name === 'UserNotFound') {
        res.status(404).send({ message: 'Пользователь с данным id не найден' });
      } else {
        res.status(500).send({ message: new ApplicationError().message });
      }
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, {
    runValidators: true,
    new: true,
  })
    .orFail(() => {
      const error = new IncorrectDataSent('обновления аватара');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Данные для обновления аватара - некорректны' });
      } else if (err.name === 'UserNotFound') {
        res.status(404).send({ message: 'Пользователь с данным id не найден' });
      } else {
        res.status(500).send({ message: new ApplicationError().message });
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
