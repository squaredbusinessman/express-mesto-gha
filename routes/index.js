const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const auth = require('../middlewares/auth');
const ApplicationError = require('../errors/ApplicationError');
const errorsCodes = require('../errors/errorsCodes');
const { createUser, login } = require('../controllers/users');
const { validateAuthorization, validateAuthentication } = require('../middlewares/validators');

router.post('/signin', validateAuthentication, login);
router.post('/signup', validateAuthorization, createUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use('*', () => {
  throw new ApplicationError(errorsCodes.NotFoundError, 'Запрашиваемая страница не существует');
});

module.exports = router;
