const express = require("express");
const { body, param } = require("express-validator");
const { addProductToCart, getListProductCart, updateProductCart, deleteProductcart } = require("../controllers/cart.controller");
const { loginRequired } = require("../middlewares/authentication");
const { validate, checkObjectId } = require("../middlewares/validator");
const router = express.Router();

/**
 * @description: Add product to cart
 * @access:
 * @method:
 * @param:
 */
router.post("/add", loginRequired,
    validate([
        body("productId").exists().isString().custom(checkObjectId)
    ]),
    addProductToCart);


/**
 * @description: Add product to cart
 * @access:
 * @method:
 * @param:
 */
router.get("/list", loginRequired, getListProductCart);


/**
 * @description: Add product to cart
 * @access:
 * @method:
 * @param:
 */
router.put("/update/:cartId", loginRequired,
    validate([
        param("cartId").exists().isString().custom(checkObjectId),
        body("quantity").exists().isString(),
    ]),
    updateProductCart);


/**
 * @description: Add product to cart
 * @access:
 * @method:
 * @param:
 */
router.delete("/delete/:cartId", loginRequired,
    validate([
        param("cartId").exists().isString().custom(checkObjectId)
    ]),
    deleteProductcart);

module.exports = router;