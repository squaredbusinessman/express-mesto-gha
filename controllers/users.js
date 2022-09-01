const User = require('../models/user');
const UserNotFound = require('../errors/UserNotFound');
const ApplicationError = require('../errors/ApplicationError');
const errorsCodes = require('../errors/errorsCodes');

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorsCodes.ValidationError).send({ message: 'Введены некорректные данные при создании пользователя' });
      } else {
        res.status(errorsCodes.InternalError).send({ message: new ApplicationError().message });
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorsCodes.ValidationError).send({ message: 'Указаны некорректные данные при запросе пользователя' });
      } else if (err.name === 'UserNotFound') {
        res.status(errorsCodes.NotFoundError).send({ message: 'Пользователь с данным id не найден' });
      } else {
        res.status(errorsCodes.InternalError).send({ message: new ApplicationError().message });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(errorsCodes.InternalError).send({ message: new ApplicationError().message });
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
    throw new UserNotFound();
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorsCodes.ValidationError).send({ message: 'Данные для обновления пользователя - некорректны' });
      } else if (err.name === 'UserNotFound') {
        res.status(errorsCodes.NotFoundError).send({ message: 'Пользователь с данным id не найден' });
      } else {
        res.status(errorsCodes.InternalError).send({ message: new ApplicationError().message });
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
      throw new UserNotFound();
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorsCodes.ValidationError).send({ message: 'Данные для обновления аватара - некорректны' });
      } else if (err.name === 'UserNotFound') {
        res.status(errorsCodes.NotFoundError).send({ message: 'Пользователь с данным id не найден' });
      } else {
        res.status(errorsCodes.InternalError).send({ message: new ApplicationError().message });
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
