const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { validateAuthorization, validateAuthentication } = require('../middlewares/validators');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', validateAuthentication, login);
router.post('/signup', validateAuthorization, createUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use('*', () => {
  throw new NotFoundError('Запрашиваемая страница не существует');
});

module.exports = router;
