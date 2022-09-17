const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const UserNotFound = require('../errors/UserNotFound');
const ApplicationError = require('../errors/ApplicationError');
const errorsCodes = require('../errors/errorsCodes');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name, about, avatar, email, password: hash,
      },
    ))
    .then((user) => {
      const userWithoutPass = user.toObject();
      delete userWithoutPass.password;
      res.status(201).send(userWithoutPass);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ApplicationError(
          errorsCodes.ValidationError,
          'Введены некорректные данные при создании пользователя',
        ));
      } else if (err.code === errorsCodes.DuplicateError) {
        next(new ApplicationError(
          errorsCodes.ExistingEmailError,
          'Пользователь с данным email уже зарегистрирован',
        ));
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
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      next(new UserNotFound());
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        next(new ApplicationError(
          errorsCodes.ValidationError,
          'Переданы некорректные данные пользователя',
        ));
      } else {
        next(err);
      }
    });
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
      if (err.name === 'ValidationError') {
        next(new ApplicationError(
          errorsCodes.ValidationError,
          'Введены некорректные данные для обновления информации о пользователе',
        ));
      } else {
        next(err);
      }
    });
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
      if (err.name === 'ValidationError') {
        next(new ApplicationError(
          errorsCodes.ValidationError,
          'Данные для обновления аватара - некорректны',
        ));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ApplicationError(errorsCodes.UnAuthorizedError, 'Введены неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new ApplicationError(errorsCodes.UnAuthorizedError, 'Введены неправильные почта или пароль');
          }

          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'very-hard-key',
            { expiresIn: '7d' },
          );

          res.send({ token });
        });
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
