const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {validateCreateCard, validateCardCommon} = require("../middlewares/validators");

router.get('/', getCards);

router.post('/', validateCreateCard, createCard);

router.delete('/:id', validateCardCommon, deleteCard);

router.put('/:id/likes', validateCardCommon, likeCard);

router.delete('/:id/likes', validateCardCommon, dislikeCard);

module.exports = router;
