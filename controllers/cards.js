const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка при получении списка карточек - ${err}` }));
};

const createCard = (req, res) => {
  const { name, link, owner } = req.body;
  return Card.create({ name, link, owner })
    .then((card) => { res.status(200).send(card); })
    .catch((err) => {
      res.status(500).send({ message: err.message });
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
