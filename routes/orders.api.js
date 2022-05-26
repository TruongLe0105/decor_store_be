const express = require("express");
const { body, param } = require("express-validator");
const { createNewOrder, getListOrders, updateOrders, deleteOrders, addProductsToCartByOldOrder } = require("../controllers/orders.controller");
const { loginRequired, adminRequired } = require("../middlewares/authentication");
const { validate, checkObjectId } = require("../middlewares/validator");
const router = express.Router();

router.post("/add", loginRequired,
    validate([
        body("cartProducts", "delivery", "totalPrice", "user").exists(),
    ]),
    createNewOrder);

router.get("/list", loginRequired, getListOrders);
router.put("/:orderId", loginRequired, validate([
    param("orderId").exists().isString().custom(checkObjectId).notEmpty()
]), updateOrders);

router.post("/cart", loginRequired, validate([
    body("orderId").exists().isString().custom(checkObjectId).notEmpty()
]), addProductsToCartByOldOrder);

module.exports = router;