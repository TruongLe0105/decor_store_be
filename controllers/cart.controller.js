const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");


const controllerCart = {};
controllerCart.addProductToCart = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;

    let { productId, quantity, cartId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError(404, "Product not found", "Add product error")
    }

    const { name, price, imageUrl } = product;
    let cart = await Cart.findOne({ _id: cartId, isDeleted: false });
    const LIMIT_PRODUCT_CAN_BUY = 9;

    if (!cart) {
        cart = await Cart.create({
            _id: cartId,
            user: currentUserId,
            products: [
                { _id: productId, name, price, imageUrl, quantity: (quantity > 0 && quantity <= LIMIT_PRODUCT_CAN_BUY) ? quantity : 1 }
            ],
            totalPrice: price,
        })
    } else {
        const productCart = cart.products.find(p => p._id.equals(productId));
        if (productCart) {
            if (productCart.quantity <= LIMIT_PRODUCT_CAN_BUY) {
                if (quantity > 0) {
                    productCart.quantity += quantity;
                }
                else if (quantity < 0 && quantity !== -1) {
                    productCart.quantity = quantity;
                } else if (quantity === -1) {
                    productCart.quantity += quantity;
                }
            }
        } else {
            cart.products.push({
                _id: productId, name, price, imageUrl, quantity: quantity > 0 ? quantity : 1
            });
        }
        cart.products = cart.products.filter(p => p.quantity > 0)
        cart.totalPrice = cart.products.reduce((total, cur) => {
            return total + cur.price * cur.quantity
        }, 0)
        await cart.save();
    }


    return sendResponse(res, 200, true, { cart }, null, "Add product to cart successful")
})


controllerCart.getListProductCart = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;

    const user = await User.findById(currentUserId);
    if (!user) {
        throw new AppError(401, "You can not access in this cart");
    }
    const { cartId } = user;

    let cart = await Cart.findOne({ _id: cartId, isDeleted: false })
    if (!cart) {
        throw new AppError(404, "Do not find products in your cart ", "Get list product error")
    }

    return sendResponse(res, 200, true, { cart }, null, "Get list product in cart successful")
})


module.exports = controllerCart;