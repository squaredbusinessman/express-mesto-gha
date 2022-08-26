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
        res.status(400).send(err.message);
      } else {
        res.status(500).send(new ApplicationError());
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send(err.message);
      } else if (err.name === 'UserNotFound') {
        res.status(404).send(err.message);
      } else {
        res.status(500).send(new ApplicationError());
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(500).send(new ApplicationError());
    });
};

const updateUserInfo = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }).orFail(() => {
    throw new IncorrectDataSent('обновления информации пользователя');
  })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(err.message);
      }  else if (err.name === 'UserNotFound') {
        res.status(404).send(err.message);
      } else {
        res.status(500).send(ApplicationError());
      }
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  })
    .orFail(() => {
      throw new IncorrectDataSent('обновления аватара');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send(err.message);
      } else if (err.name === 'UserNotFound') {
        res.status(404).send(err.message);
      } else {
        res.status(500).send(new ApplicationError());
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
