var express = require('express');
const { body } = require('express-validator');
const { register, login, getCurrentUserProfile, updateCurrentProfile, changePassword, deactivateAccount } = require('../controllers/user.controller');
const { loginRequired } = require('../middlewares/authentication');
const { validate } = require('../middlewares/validator');
var router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/password',
    loginRequired,
    validate([
        body("password", "newPassword").exists().isString()
    ]),
    changePassword);

router.get('/profile', loginRequired, getCurrentUserProfile);

router.put('/profile/update', loginRequired, updateCurrentProfile);

router.put('/password', (req, res, next) => res.send("ahihi"));

router.delete('/account/me', loginRequired, deactivateAccount);

module.exports = router;
