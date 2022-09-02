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
      if (err.statusCode === errorsCodes.ValidationError) {
        throw new ApplicationError(errorsCodes.ValidationError, 'Переданы некорректные данные при создании карточки');
      } else {
        next(err);
      }
    }).catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      const owner = card.owner.toString().replace('new ObjectId("', '');
      if (owner !== req.user._id) {
        throw new ApplicationError(errorsCodes.AccessError, 'Можно удалять только созданные вами посты');
      } else {
        Card.findByIdAndRemove(req.params.id)
          .then((removedCard) => { res.send(removedCard); });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.statusCode === errorsCodes.ValidationError) {
        throw new ApplicationError(errorsCodes.ValidationError, 'Переданы некорректные данные для удаления карточки');
      } else if (err.statusCode === errorsCodes.NotFoundError) {
        throw new CardNotFound();
      } else {
        next(err);
      }
    }).catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.statusCode === errorsCodes.ValidationError) {
        throw new ApplicationError(errorsCodes.ValidationError, 'Переданы некорректные данные при лайке выбранного поста');
      } else if (err.statusCode === errorsCodes.NotFoundError) {
        throw new CardNotFound();
      } else {
        next(err);
      }
    }).catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.statusCode === errorsCodes.ValidationError) {
        throw new ApplicationError(errorsCodes.ValidationError, 'Переданы некорректные данные при дизлайке выбранного поста');
      } else if (err.statusCode === errorsCodes.NotFoundError) {
        throw new CardNotFound();
      } else {
        next(err);
      }
    }).catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
