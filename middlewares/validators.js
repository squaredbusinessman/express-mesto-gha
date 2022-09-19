const { celebrate, Joi } = require('celebrate');

const avatarUrlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-(+&@#/%+~_|])/ig;

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateAuthorization = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .pattern(avatarUrlRegex)
      .message('Введите валидный URL-адрес аватара'),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string()
      .required()
      .regex(/https?:\/\/(www)?(\.)?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2,4}[a-zа-яё\-._~:/?#[\]@!$&'()*+,;=]*#?/i),
  }).unknown(true),
});

const validateCardCommon = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateAuthentication,
  validateAuthorization,
  validateCreateCard,
  validateCardCommon,
  avatarUrlRegex,
};
