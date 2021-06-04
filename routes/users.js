const router = require('express').Router();
const { returnUserInfo, updateUserInfo } = require('../controllers/users');

router.get('/me', returnUserInfo);
router.patch('/me', updateUserInfo);

module.exports = router;
