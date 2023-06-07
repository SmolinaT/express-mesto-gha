const router = require('express').Router();
const {
  getUser,
  getUserMe,
  getUserbyId,
  updateProfile,
  updateAvatar,
} = require('../controllers/user');
const { validateUserId, validateUserUpdate, validateAvatarUpdate } = require('../middlewares/validate');

router.get('/', getUser);

router.get('/me', getUserMe);

router.get('/:userId', validateUserId, getUserbyId);

router.patch('/me', validateUserUpdate, updateProfile);

router.patch('/me/avatar', validateAvatarUpdate, updateAvatar);

module.exports = router;
