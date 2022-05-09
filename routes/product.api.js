const express = require("express");
const { param, body } = require("express-validator");
const { addProductByAdmin, updateProductByAdmin, deleteProductByAdmin, getListProduct, getSingleProductById } = require("../controllers/product.controller");
const { loginRequired } = require("../middlewares/authentication");
const { checkObjectId, validate } = require("../middlewares/validator");
const router = express.Router();

router.post("/add", addProductByAdmin) //Admin route, làm test thử

router.get("/list", getListProduct)

router.get("/:productId", validate([
    param("productId").exists().isString().custom(checkObjectId)
]),
    getSingleProductById)

router.put("/update/:id", updateProductByAdmin) //Admin route

router.delete("/delete/:id", deleteProductByAdmin) //Admin route

module.exports = router;