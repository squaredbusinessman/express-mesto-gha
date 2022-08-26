const router = require('express').Router();
const {
  createUser,
  getUser,
  getUsers,
  updateAvatar,
  updateUserInfo,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
