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
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
        __v: user.__v,
      })
    })
    .catch((err) => {
      if (err.statusCode === errorsCodes.ValidationError || err.message === 'user validation failed') {
        throw new ApplicationError(errorsCodes.ValidationError, 'Введены некорректные данные при создании пользователя');
      } else if (err.statusCode === errorsCodes.ExistingEmailError) {
        next(new ApplicationError(errorsCodes.ExistingEmailError, 'пользователь с данным email уже зарегистрирован'));
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
        next(new ApplicationError(errorsCodes.ValidationError, 'Указаны некорректные данные пользователя'));
      } else if (err.statusCode === errorsCodes.NotFoundError) {
        next(new UserNotFound());
      } else {
        next(err);
      }
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
      if (err.kind === 'ObjectId') {
        next(new ApplicationError(errorsCodes.ValidationError, 'Неверный формат id пользователя'));
      } else if (err.message === 'CastError' || err.statusCode === errorsCodes.ValidationError) {
        next(new ApplicationError(errorsCodes.ValidationError, 'Переданы некорректные данные пользователя'));
      } else if (err.statusCode === errorsCodes.NotFoundError) {
        next(new UserNotFound());
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
        next(new UserNotFound());
      } else if (err.statusCode === errorsCodes.ValidationError || err.name === 'CastError') {
        next(new ApplicationError(errorsCodes.ValidationError, 'Введены некорректные данные для обновления информации о пользователе'));
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
        next(new ApplicationError(errorsCodes.ValidationError, 'Данные для обновления аватара - некорректны'));
      } else if (err.name === 'UserNotFound') {
        next(new UserNotFound());
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
        throw new ApplicationError(errorsCodes.UnAuthorizedError, 'Введены неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new ApplicationError(errorsCodes.UnAuthorizedError, 'Введены неправильные почта или пароль');
          }

          const token = jwt.sign({ _id: user._id }, 'very-hard-key', { expiresIn: '7d' });

          res.cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              sameSite: true,
            }).end();
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
