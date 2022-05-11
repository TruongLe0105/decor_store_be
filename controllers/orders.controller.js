const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Cart = require("../models/Cart");
const Orders = require("../models/Orders");


const controllerOrders = {};
controllerOrders.addNewOrders = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const { productIds } = req.body;
    let total = 0;

    // const products = productIds.map(productId => {
    //     const product = await Cart.findOne({})
    // })
    const carts = await Cart.find({ userId: currentUserId, isDeleted: false });
    if (!carts) {
        throw new AppError(404, "Your cart not found", "Add new order error")
    }
    // const total = carts.map(cart => cart.totalPrice)
    // console.log("total", total)

    const totalPrice = total.reduce((acc, currentValue) => {
        return total + currentValue;
    }, 0)

    const orders = await Orders.create({
        buyer: currentUserId,
        listProducts: listCartId,
        status: "pending",
        ordersPrice: totalPrice,
    })

    return sendResponse(res, 200, true, { orders }, null, "");
});
controllerOrders.getListOrders = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    let { limit, page, ...filter } = req.query;
    limit = limit || 2;
    page = page || 1;

    const filterCondition = [];
    // "pending", "confirmed", "delivering", "completed", "declined"
    const allow = ["name", "collections"];
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

    const productsInOrders = await Orders.find({ filterCriteria })
        .sort({ createAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("listProducts")

    return sendResponse(res, 200, true, { productsInOrders, count, totalPage }, null, "")
});
controllerOrders.updateOrders = catchAsync(async (req, res, next) => {

    return sendResponse(res, 200, true, {}, null, "")
});
controllerOrders.deleteOrders = catchAsync(async (req, res, next) => {

    return sendResponse(res, 200, true, {}, null, "")
});

module.exports = controllerOrders;