const router = require('express').Router();
const {
  getUser,
  getUsers,
  getUserData,
  updateAvatar,
  updateUserInfo,
} = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');

router.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(true),
}), getUsers);
router.get('/me', getUserData);
router.get('/:id', getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }).unknown(true),
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(true),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(true),
}), updateAvatar);

module.exports = router;
