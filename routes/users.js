const router = require('express').Router();
const {
  getUser,
  getUsers,
  getUserData,
  updateAvatar,
  updateUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserData);
router.get('/:id', getUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
