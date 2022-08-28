const router = require('express').Router();
const {
  createUser,
  getUser,
  getUsers,
  updateAvatar,
  updateUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
