const Card = require('../models/card');
const ApplicationError = require('../errors/ApplicationError');
const IncorrectDataSent = require("../errors/IncorrectDataSent");
const CardNotFound = require("../errors/CardNotFound");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(500).send({ message: new ApplicationError().message });
    });
};

const createCard = (req, res) => {
  const { name, link, owner } = req.body;
  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card._id);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: new IncorrectDataSent('создания карточки') });
      } else {
        res.status(500).send({ message: new ApplicationError().message });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.status(200).send(card);
    })
    .orFail(() => {
      const error = new CardNotFound();
      error.statusCode = 404;
      throw error;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(500).send({ message: new ApplicationError().message });
      }

      res.status(err.statusCode).send({ message: err.message });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new CardNotFound();
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при лайке' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: 'Передан несуществующий id карточки' });
      } else {
        res.status(500).send({ message: new ApplicationError().message });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new CardNotFound();
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при дизлайке' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: 'Передан несуществующий id карточки' });
      } else {
        res.status(500).send({ message: new ApplicationError().message });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
