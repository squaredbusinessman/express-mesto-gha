const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string()
      .required()
      .regex(/https?:\/\/(www)?(\.)?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2,4}[a-zа-яё\-._~:/?#[\]@!$&'()*+,;=]*#?/i),
  }).unknown(true),
}), createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
