const Card = require('../models/card');
const ApplicationError = require('../errors/ApplicationError');
const IncorrectDataSent = require("../errors/IncorrectDataSent");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      throw new ApplicationError();
    });
};

const createCard = (req, res) => {
  const { name, link, owner } = req.body;
  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new IncorrectDataSent('создания карточки');
      } else {
        throw new ApplicationError();
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      res.status(err.status).send(err.message);
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      res.status(err.status).send(err.message);
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      res.status(err.status).send(err.message);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
