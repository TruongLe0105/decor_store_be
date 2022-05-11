const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Cart = require("../models/Cart");
const Product = require("../models/Product");


const controllerCart = {};
controllerCart.addProductToCart = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError(404, "Product not found", "Add product error")
    }
    const { name, price, images } = product;
    let cart = await Cart.findOne({ customer: currentUserId, isDeleted: false });

    if (!cart) {
        console.log("a")
        cart = await Cart.create({
            customer: currentUserId,
            products: [
                { _id: productId, name, price, images, quantity: quantity > 0 ? quantity : 1 }
            ],
            totalPrice: price
        })
    }
    else {
        //         // let found = false;
        //         // cart.products = cart.products.map(product => {
        //         //     if (product._id.equals(productId)) {
        //         //         found = true;
        //         //         return {...product, quantity: product.quantity + 1}
        //         //     }
        //         //     return product;
        //         // })
        //         // if (!found) {
        //         //     cart.products.push({
        //         //         _id: productId, name, price, images, quantity: 1
        //         //     });
        //         // }
        const productCart = cart.products.find(p => p._id.equals(productId));
        if (productCart) {
            console.log("c")
            productCart.quantity += quantity > 0 ? quantity : 1;
        } else {
            console.log("b")
            cart.products.push({
                _id: productId, name, price, images, quantity: quantity > 0 ? quantity : 1
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

    let cart = await Cart.findOne({ userId: currentUserId, isDeleted: false })
    if (!cart) {
        throw new AppError(404, "Can not find products in your cart ", "Get list product error")
    }

    return sendResponse(res, 200, true, { cart }, null, "Get list product in cart successful")
})


module.exports = controllerCart;