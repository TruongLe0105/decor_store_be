var express = require('express');
var router = express.Router();

/** User endpoints (UF) */
const userRouter = require("./users.api");
router.use("/users", userRouter);

const authRouter = require("./auth.api");
router.use("/auth", authRouter)

const cartRouter = require("./cart.api");
router.use("/cart", cartRouter);

const productRouter = require("./product.api");
router.use("/products", productRouter);

const orderRouter = require("./orders.api");
router.use("/orders", orderRouter);

module.exports = router;
