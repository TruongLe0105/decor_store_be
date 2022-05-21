var express = require('express');
const { body, param } = require('express-validator');
const { route } = require('express/lib/application');
const { register, getCurrentUserProfile, updateCurrentProfile, changePassword, deactivateAccount, getUsersByAdmin, updateAddress, deleteAddress, addNewAddress } = require('../controllers/user.controller');
const { loginRequired, adminRequired } = require('../middlewares/authentication');
const { validate, checkObjectId } = require('../middlewares/validator');
var router = express.Router();

router.get('/me', loginRequired, getCurrentUserProfile);

router.post('/register', register);

router.post('/me/address/add', loginRequired, validate([
    body('address', 'numberOfPhone', 'receiver').exists().isString().notEmpty()
]), addNewAddress);

router.put('/me/update', loginRequired, updateCurrentProfile);

router.put('/address/:addressId', loginRequired, validate([
    param('addressId').exists().isString().custom(checkObjectId)
]), updateAddress);

router.put('/me/password',
    loginRequired,
    validate([
        body("password", "newPassword").exists().isString(),
    ]),
    changePassword);

router.delete('/account/me', loginRequired, deactivateAccount);

router.delete('/address/:addressId', loginRequired, validate([
    param('addressId').exists().isString().custom(checkObjectId)
]), deleteAddress);

module.exports = router;
