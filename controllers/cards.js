const Card = require('../models/card');
const ApplicationError = require('../errors/ApplicationError');
const CardNotFound = require('../errors/CardNotFound');
const {STATUS_CODES} = require('../errors/statusCodes');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(STATUS_CODES.internalError).send({ message: new ApplicationError().message });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.incorrectData).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(STATUS_CODES.internalError).send({ message: new ApplicationError().message });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new CardNotFound();
      error.statusCode = error.status;
      throw error;
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODES.incorrectData).send({ message: 'Переданы некорректные данные для удаления карточки' });
      } else if (err.statusCode === 404) {
        res.status(STATUS_CODES.notFound).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(STATUS_CODES.internalError).send({ message: new ApplicationError().message });
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
      error.statusCode = error.status;
      throw error;
    })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODES.incorrectData).send({ message: 'Переданы некорректные данные при лайке' });
      } else if (err.statusCode === 404) {
        res.status(STATUS_CODES.notFound).send({ message: 'Передан несуществующий id карточки' });
      } else {
        res.status(STATUS_CODES.internalError).send({ message: new ApplicationError().message });
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
      error.statusCode = error.status;
      throw error;
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODES.incorrectData).send({ message: 'Переданы некорректные данные при дизлайке' });
      } else if (err.statusCode === 404) {
        res.status(STATUS_CODES.notFound).send({ message: 'Передан несуществующий id карточки' });
      } else {
        res.status(STATUS_CODES.internalError).send({ message: new ApplicationError().message });
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
