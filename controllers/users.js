const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const UserNotFound = require('../errors/UserNotFound');
const ApplicationError = require('../errors/ApplicationError');
const errorsCodes = require('../errors/errorsCodes');

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name,
        about,
        avatar,
        email,
        password: hash,
      },
    ))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.statusCode === errorsCodes.ValidationError || err.message === 'user validation failed') {
        throw new ApplicationError(errorsCodes.ValidationError, 'Введены некорректные данные при создании пользователя');
      } else if (err.statusCode === errorsCodes.ExistingEmailError) {
        throw new ApplicationError(errorsCodes.ExistingEmailError, 'пользователь с данным email уже зарегистрирован');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const getUserData = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.statusCode === errorsCodes.ValidationError) {
        throw new ApplicationError(errorsCodes.ValidationError, 'Указаны некорректные данные пользователя');
      } else if (err.statusCode === errorsCodes.NotFoundError) {
        throw new UserNotFound();
      } else {
        next(err);
      }
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw ApplicationError(errorsCodes.ValidationError, 'Неверный формат id пользователя');
      } else if (err.message === 'CastError' || err.statusCode === errorsCodes.ValidationError) {
        throw new ApplicationError(errorsCodes.ValidationError, 'Переданы некорректные данные пользователя');
      } else if (err.statusCode === errorsCodes.NotFoundError) {
        throw new UserNotFound();
      } else {
        next(err);
      }
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({}, { password: 0 })
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }, {
    runValidators: true,
    new: true,
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.statusCode === errorsCodes.NotFoundError) {
        throw new UserNotFound();
      } else if (err.statusCode === errorsCodes.ValidationError || err.name === 'CastError') {
        throw new ApplicationError(errorsCodes.ValidationError, 'Введены некорректные данные для обновления информации о пользователе');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, {
    runValidators: true,
    new: true,
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.statusCode === errorsCodes.ValidationError) {
        throw new ApplicationError(errorsCodes.ValidationError, 'Данные для обновления аватара - некорректны');
      } else if (err.name === 'UserNotFound') {
        throw new UserNotFound();
      } else {
        next(err);
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Введены неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Введены неправильные почта или пароль'));
          }

          const token = jwt.sign({ _id: user._id }, 'very-hard-key', { expiresIn: '7d' });

          res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUserData,
  getUser,
  getUsers,
  updateAvatar,
  updateUserInfo,
  login,
};
