const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Cart = require("../models/Cart");
const Product = require("../models/Product");


const controllerCart = {};
controllerCart.addProductToCart = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const { productId } = req.body

    const product = await Product.findOne({ _id: productId })
    if (!product) {
        throw new AppError(404, "Product not found", "Add product error")
    }

    let productCart = await Cart.findOne({ owner: currentUserId })
    console.log(productCart)
    // nếu k tìm thấy thì tạo mới cart
    if (!productCart) {
        productCart = await Cart.create({
            owner: currentUserId,
            products: productId,
            quantity: 1,
            totalPrice: product.price
        })
    } else if (!productCart.products.includes(productId)) {
        productCart.products.push(productId)
        productCart.save()
    }
    else if (productCart.products.includes(productId)) {

    }

    return sendResponse(res, 200, true, productCart, null, "Add product to cart successful")
})

controllerCart.getListProductCart = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    let { limit, page, ...filter } = req.query;
    limit = limit || 5;
    page = page || 1;

    const filterCondition = [];

    const allow = ["name", "collections"]
    allow.forEach(field => {
        if (filter[field] !== undefined) {
            filterCondition.push({
                [field]: { $regex: filter[field], $options: "i" }
            })
        }
    });
    const filterCriteria = filterCondition.length ? { $and: filterCondition } : {}

    const products = await Product.find(filterCriteria)
    const productId = products.map(product => product._id)

    const count = await Cart.countDocuments({ owner: currentUserId, product: { $in: productId } })
    const totalPage = Math.ceil(count / limit)
    const offset = limit * (page - 1)

    const productCart = await Cart.find({ owner: currentUserId, product: { $in: productId } })
        .sort({ updatedAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("owner")
        .populate("product")

    if (!productCart) {
        throw new AppError(404, "You can not see list products of this user", "Get list product error")
    }

    return sendResponse(res, 200, true, { productCart, count, totalPage }, null, "Get list product in cart successful")
})

controllerCart.updateProductCart = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const { quantity } = req.body;
    const { cartId } = req.params;

    let productCart = await Cart.findOne({ owner: currentUserId, _id: cartId })
        .populate("product");
    if (!productCart) {
        throw new AppError(404, "You can not delete this product", "delete product error")
    }

    productCart.quantity = quantity;
    productCart.totalPrice = productCart.product.price * quantity;
    productCart.save();

    return sendResponse(res, 200, true, productCart, null, "Update cart successful")
})

controllerCart.deleteProductcart = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const { cartId } = req.params
    console.log(cartId)

    const productCart = await Cart.findOneAndDelete({ owner: currentUserId, _id: cartId })
    if (!productCart) {
        throw new AppError(404, "You can not delete this product", "delete product error")
    }

    return sendResponse(res, 200, true, {}, null, "Delete successful")
})


module.exports = controllerCart;