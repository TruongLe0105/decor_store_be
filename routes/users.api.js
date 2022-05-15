var express = require('express');
const { body } = require('express-validator');
const { register, getCurrentUserProfile, updateCurrentProfile, changePassword, deactivateAccount, getUsersByAdmin } = require('../controllers/user.controller');
const { loginRequired, adminRequired } = require('../middlewares/authentication');
const { validate } = require('../middlewares/validator');
var router = express.Router();

router.get('/me', loginRequired, getCurrentUserProfile);

// router.get('/list', loginRequired, adminRequired, getUsersByAdmin)

router.post('/register', register);

router.put('/me/update', loginRequired, updateCurrentProfile);

router.put('/password',
    loginRequired,
    validate([
        body("password", "newPassword").exists().isString()
    ]),
    changePassword);

router.delete('/account/me', loginRequired, deactivateAccount);

module.exports = router;
