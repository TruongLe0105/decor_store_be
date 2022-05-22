const express = require("express");
const { param, body } = require("express-validator");
const {
    updateProductByAdmin,
    deleteProductByAdmin,
    getListProduct,
    getSingleProductById,
    addProductToList,
} = require("../controllers/product.controller");
const { loginRequired, adminRequired } = require("../middlewares/authentication");
const { checkObjectId, validate } = require("../middlewares/validator");
const router = express.Router();

router.get("/", getListProduct);

router.post("/add", loginRequired, adminRequired, validate([
    body("imageUrl", "name", "categories").exists().isString().notEmpty(),
    body("quantity", "price").exists().notEmpty(),
]), addProductToList);

router.get("/:productId", validate([
    param("productId").exists().isString().custom(checkObjectId)
]),
    getSingleProductById);

router.put("/:productId", loginRequired, adminRequired,
    validate([
        param("productId").exists().isString().custom(checkObjectId)
    ]),
    adminRequired, updateProductByAdmin);//Admin route

router.delete("/:productId", loginRequired, adminRequired,
    validate([
        param("productId").exists().isString().custom(checkObjectId)
    ]),
    deleteProductByAdmin);//Admin route

module.exports = router;