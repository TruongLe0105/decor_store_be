const express = require("express");
const { param, body } = require("express-validator");
const { addProductByAdmin, updateProductByAdmin, deleteProductByAdmin, getListProduct, getSingleProductById } = require("../controllers/product.controller");
const { loginRequired, adminRequired } = require("../middlewares/authentication");
const { checkObjectId, validate } = require("../middlewares/validator");
const router = express.Router();

router.post("/add", loginRequired, adminRequired, addProductByAdmin) //Admin route, làm test thử

router.get("/", getListProduct)

router.get("/:productId", validate([
    param("productId").exists().isString().custom(checkObjectId)
]),
    getSingleProductById)

router.put("/update/:productId", loginRequired,
    validate([
        param("productId").exists().isString().custom(checkObjectId)
    ]),
    adminRequired, updateProductByAdmin) //Admin route

router.delete("/delete/:productId", loginRequired,
    validate([
        param("productId").exists().isString().custom(checkObjectId)
    ]),
    adminRequired, deleteProductByAdmin);//Admin route

module.exports = router;