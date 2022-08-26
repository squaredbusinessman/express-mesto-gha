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
        res.status(400).send(new IncorrectDataSent('создания пользователя'));
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
        res.status(err.status).send(err.message);
      } else if (err.status === 404) {
        res.status(err.status).send(err.message);
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
  console.log(req.params);
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }, {
    runValidators: true,
    new: true,
  }).orFail(() => {
    throw new IncorrectDataSent('обновления информации пользователя');
  })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(err.status).send(err.message);
      } else if (err.status === 404) {
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send(ApplicationError());
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
      throw new IncorrectDataSent('обновления аватара');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send(new IncorrectDataSent('обновления аватара'));
      } else if (err.statusCode === 404) {
        res.status(404).send(new UserNotFound());
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
