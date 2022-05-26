const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Cart = require("../models/Cart");
const Orders = require("../models/Orders");
const User = require("../models/User");


const controllerOrders = {};
controllerOrders.createNewOrder = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const { cartProducts, delivery, totalPrice, user } = req.body;
    const { numberOfPhone, address, receiver } = delivery;

    if (user._id !== currentUserId) {
        throw new AppError(404, "User not found", "Checkout error")
    }

    if (cartProducts.length === 0) {
        throw new AppError(400, "Đơn hàng không có sản phẩm", "Create order error")
    }
    const order = await Orders.create({
        user,
        address,
        numberOfPhone,
        receiver,
        cartProducts,
        totalPrice,
    });

    let cart = await Cart.findOneAndUpdate({ _id: user.cartId, isDeleted: false }, { products: [], totalPrice: 0 });

    return sendResponse(res, 200, true, { order }, null, "");
});

controllerOrders.getListOrders = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    let { ...filter } = req.query;

    const filterCondition = [{ isDeleted: false, user: currentUserId }];
    const allow = ["status"]
    allow.forEach(field => {
        if (filter[field] !== undefined) {
            filterCondition.push({
                [field]: { $regex: filter[field], $options: "i" }
            });
        }
    });
    const filterCriteria = filterCondition.length ? { $and: filterCondition } : {}

    const count = await Orders.countDocuments(filterCriteria);

    const orders = await Orders.find(filterCriteria)
        .sort({ updatedAt: -1 })

    return sendResponse(res, 200, true, { orders }, null, "Get list order successful")
});

controllerOrders.updateOrders = catchAsync(async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;
    console.log(status)

    let order = await Orders.findOneAndUpdate({ _id: orderId }, { status });
    if (!order) {
        throw new AppError(404, "Not found order", "Update order error")
    };

    return sendResponse(res, 200, true, { order }, null, "")
});

controllerOrders.addProductsToCartByOldOrder = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const { orderId } = req.body;

    let cart = await Cart.findOne({ user: currentUserId });
    if (!cart) {
        throw new AppError(404, "Not found cart", "Add product to cart error")
    };
    const order = await Orders.findById(orderId);
    if (!order) {
        throw new AppError(404, "Can not found cart by old order", "Add product to cart error")
    };

    const productIds = order.cartProducts.map(product => product._id);
    console.log(productIds)

    cart.products = cart.products.filter(({ _id }) => !productIds.includes(_id.toString()));
    const priceAfterFilter = cart.products.reduce((acc, cur) => {
        return acc + cur.quantity * cur.price
    }, 0);

    order.cartProducts.map(product => {
        cart.products.unshift(product)
    });

    cart.totalPrice = order.totalPrice + priceAfterFilter;
    await cart.save();

    return sendResponse(res, 200, true, { cart }, null, "Add product to cart by old order successful")
});

module.exports = controllerOrders;