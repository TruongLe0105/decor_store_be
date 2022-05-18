const express = require("express");
const { body } = require("express-validator");
const { createNewOrder, getListOrders, updateOrders, deleteOrders } = require("../controllers/orders.controller");
const { loginRequired } = require("../middlewares/authentication");
const { validate, checkObjectId } = require("../middlewares/validator");
const router = express.Router();

router.post("/add", loginRequired,
    validate([
        body("cartProducts", "delivery", "totalPrice", "user").exists(),
    ]),
    createNewOrder);

router.get("/list", loginRequired, getListOrders);
router.put("/update/:ordersId", loginRequired, updateOrders);
router.delete("/delete/:ordersId", loginRequired, deleteOrders);

module.exports = router;