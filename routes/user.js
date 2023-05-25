const router = require('express').Router();
const {
  getUser,
  getUserbyId,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/user');

router.get('/', getUser);

router.get('/:userId', getUserbyId);

router.post('/', createUser);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
