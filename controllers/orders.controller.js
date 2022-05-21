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
    console.log("cart", cart);

    return sendResponse(res, 200, true, { order }, null, "");
});
controllerOrders.getListOrders = catchAsync(async (req, res, next) => {
    let { limit, page, ...filter } = req.query;
    limit = limit || 5;
    page = page || 1;

    const filterCondition = [];
    const allow = ["pending", "shipping", "completed", "declined"]
    allow.forEach(field => {
        if (filter[field] !== undefined) {
            filterCondition.push({
                [field]: { $regex: filter[field], $options: "i" }
            });
        }
    });
    const filterCriteria = filterCondition.length ? { $and: filterCondition } : {}

    const count = await Cart.countDocuments({ filterCriteria });
    const offset = limit * (page - 1);
    const totalPage = Math.ceil(count / limit);

    const order = await Orders.find({ filterCriteria })
        .sort({ updatedAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("listProducts")

    return sendResponse(res, 200, true, { order, count, totalPage }, null, "")
});
controllerOrders.updateOrders = catchAsync(async (req, res, next) => {

    return sendResponse(res, 200, true, {}, null, "")
});
controllerOrders.deleteOrders = catchAsync(async (req, res, next) => {

    return sendResponse(res, 200, true, {}, null, "")
});

module.exports = controllerOrders;