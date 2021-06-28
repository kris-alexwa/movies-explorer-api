const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { returnUserInfo, updateUserInfo } = require('../controllers/users');

router.get('/me', returnUserInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUserInfo);

module.exports = router;
