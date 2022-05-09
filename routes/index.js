var express = require('express');
var router = express.Router();

/** User endpoints (UF) */
const userRouter = require("./users.api");
router.use("/user", userRouter);

const cartRouter = require("./cart.api")
router.use("/cart", cartRouter)

const productRouter = require("./product.api")
router.use("/product", productRouter)

const orderRouter = require("./orders.api")
router.use("/orders", orderRouter)

module.exports = router;
