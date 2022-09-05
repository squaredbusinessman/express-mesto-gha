const Card = require('../models/card');
const ApplicationError = require('../errors/ApplicationError');
const CardNotFound = require('../errors/CardNotFound');
const errorsCodes = require('../errors/errorsCodes');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ApplicationError(
          errorsCodes.ValidationError,
          'Переданы некорректные данные при создании карточки',
        );
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(() => {
      throw new CardNotFound();
    })
    .then((card) => {
      const owner = card.owner
        .toString()
        .replace('new ObjectId("', '');
      if (owner !== req.user._id) {
        next(new ApplicationError(
          errorsCodes.AccessError,
          'Можно удалять только созданные вами посты',
        ));
      } else {
        Card.findByIdAndRemove(req.params.id)
          .orFail(() => {
            throw new CardNotFound();
          })
          .then((removedCard) => { res.send(removedCard); });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ApplicationError(
          errorsCodes.ValidationError,
          'Переданы некорректные данные для удаления карточки',
        ));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new CardNotFound();
      }
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ApplicationError(
          errorsCodes.ValidationError,
          'Переданы некорректные данные при лайке выбранного поста',
        ));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new CardNotFound();
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ApplicationError(errorsCodes.ValidationError, 'Переданы некорректные данные при дизлайке выбранного поста'));
      } else {
        next(err);
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
