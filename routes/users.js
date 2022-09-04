const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getUsers,
  getUserData,
  updateAvatar,
  updateUserInfo,
} = require('../controllers/users');

// eslint-disable-next-line prefer-regex-literals
const avatarRegExp = new RegExp('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=.]+$');

router.get('/', getUsers);
router.get('/me', getUserData);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .pattern(avatarRegExp)
      .message('Поле "avatar" должно быть валидным url-адресом'),
  }),
}), updateAvatar);

module.exports = router;
