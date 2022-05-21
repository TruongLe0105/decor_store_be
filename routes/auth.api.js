const express = require("express");
const { param } = require("express-validator");
const {
    loginWithEmailPassword,
    addProductToList,
    updateProducts,
    getListUsers,
    getListOrdersByAdmin,
    updateOrderByAdmin
} = require("../controllers/auth.controller");
const { loginRequired, adminRequired } = require("../middlewares/authentication");
const { checkObjectId, validate } = require("../middlewares/validator");
const router = express.Router();

/**
 * @route POST api/auth/login
 * @description Login with email
 * @access Public
 */
router.post("/login", loginWithEmailPassword);

router.get("/list", loginRequired, adminRequired, getListUsers);

router.get("/orders", loginRequired, adminRequired, getListOrdersByAdmin);

router.put("/:orderId", loginRequired, adminRequired,
    validate([
        param("orderId").exists().isString().notEmpty().custom(checkObjectId)
    ]),
    updateOrderByAdmin);

// router.delete("/:orderId", loginRequired, adminRequired, deleteOrdersByAdmin);

module.exports = router;