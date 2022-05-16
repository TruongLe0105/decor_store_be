const express = require("express");
const { body } = require("express-validator");
const { addProductToCart, getListProductCart, updateProductCart, deleteProductcart } = require("../controllers/cart.controller");
const { loginRequired } = require("../middlewares/authentication");
const { validate, checkObjectId } = require("../middlewares/validator");
const router = express.Router();

router.post("/add", loginRequired,
    validate([
        body("productId").exists().isString().custom(checkObjectId),
        // body("quantity").exists().isNumeric()
    ]),
    addProductToCart);

router.get("/", loginRequired,
    // validate([
    //     body("cartId").exists().isString().custom(checkObjectId),
    // ]),
    getListProductCart);

// router.put("/update/:cartId", loginRequired,
//     validate([
//         param("cartId").exists().isString().custom(checkObjectId),
//         body("quantity").exists().isString(),
//     ]),
//     updateProductCart);

// router.delete("/delete/:cartId", loginRequired,
//     validate([
//         param("cartId").exists().isString().custom(checkObjectId)
//     ]),
//     deleteProductcart);

module.exports = router;