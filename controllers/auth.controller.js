const bcrypt = require("bcryptjs");
const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Cart = require("../models/Cart");
const Orders = require("../models/Orders");
const User = require("../models/User");


//ADMIN
const controllerAuth = {};
controllerAuth.loginWithEmailPassword = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isDeleted: false }, "+password");
    if (!user) {
        throw new AppError(404, "User not found", "Login error")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new AppError(400, "Wrong password", "Login error")
    }
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
        throw new AppError(404, "cart not found", "login error")
    };

    const accessToken = user.generateToken();

    return sendResponse(
        res,
        200,
        true,
        { user, cart, accessToken },
        null,
        "Login successful")
});

controllerAuth.getListUsers = catchAsync(async (req, res, next) => {
    let { limit, page, ...filter } = req.query;
    console.log("limit", limit)
    limit = limit || 5;
    page = page || 1;
    console.log(filter)

    const filterCondition = [{ isDeleted: false }];

    const allow = ["userName", "role"];
    allow.forEach(field => {
        if (filter[field] !== undefined) {
            filterCondition.push({
                [field]: { $regex: filter[field], $options: "i" }
            });
        }
    });

    const filterCriteria = filterCondition.length ? { $and: filterCondition } : {}
    console.log(filterCriteria)
    const count = await User.countDocuments(filterCriteria);
    const totalPage = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const users = await User.find(filterCriteria)
        .sort({ updatedAt: -1 })
        .skip(offset)
        .limit(limit)

    return sendResponse(res, 200, true, { users, totalPage, count }, null, "Get list of users successful")
});

controllerAuth.getListOrdersByAdmin = catchAsync(async (req, res, next) => {
    let { limit, page, ...filter } = req.query;
    console.log("limit", limit)
    limit = limit || 5;
    page = page || 1;
    console.log(filter)

    const filterCondition = [{ isDeleted: false }];

    const allow = ["receiver", "status"];
    allow.forEach(field => {
        if (filter[field] !== undefined) {
            filterCondition.push({
                [field]: { $regex: filter[field], $options: "i" }
            });
        }
    });

    const filterCriteria = filterCondition.length ? { $and: filterCondition } : {}
    console.log(filterCriteria)
    const count = await Orders.countDocuments(filterCriteria);
    const totalPage = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const orders = await Orders.find(filterCriteria)
        .sort({ updatedAt: -1 })
        .skip(offset)
        .limit(limit)

    return sendResponse(res, 200, true, { orders, count, totalPage }, null, "Get list order success")
});

controllerAuth.updateOrderByAdmin = catchAsync(async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!orderId) {
        throw new AppError(404, "not found orderId", "update error")
    }

    let order = await Orders.findByIdAndUpdate(orderId, { status });
    if (!order) {
        throw new AppError(404, "Order not found", "Update order error!")
    };
    order = await Orders.findOne({ _id: orderId })
    console.log(order)

    return sendResponse(res, 200, true, { order }, null, "Update successful!")
})


module.exports = controllerAuth;
