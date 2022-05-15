const bcrypt = require("bcryptjs");
const { SchemaTypes } = require("mongoose");
const { catchAsync, sendResponse, AppError, generateRandomHexString } = require("../helpers/utils");
const Cart = require("../models/Cart");
const User = require("../models/User");

const controllerUser = {};
controllerUser.register = catchAsync(async (req, res, next) => {
    let { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
        throw new AppError(409, "User already exists", "Register error")
    }
    console.log("render")
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt)

    user = await User.create({
        name,
        email,
        password,
    });

    console.log("user", user)
    let cart = await Cart.findOne({ user: user._id, isDeleted: false })
    if (cart) {
        throw new AppError(400, "Cart already exits", "Register error")
    }
    cart = await Cart.create({
        user: user._id,
        products: [],
    });
    console.log("abc")

    console.log("cart", cart)

    user.cartId = cart._id;
    await user.save();
    console.log("userSave", user)

    const accessToken = user.generateToken()

    return sendResponse(res, 200, true, { user, cart, accessToken }, null, "Register successful")
});

controllerUser.getCurrentUserProfile = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const user = await User.findOne({ _id: currentUserId, isDeleted: false })
    // .populate("cartId")
    if (!user) {
        throw new AppError(404, "User not found", "Get profile user error")
    }

    return sendResponse(res, 200, true, user, null, "Get profile successful")
});

controllerUser.updateCurrentProfile = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const body = req.body
    let user = await User.findOne({ _id: currentUserId, isDeleted: false })
    if (!user) {
        throw new AppError(404, "User not found", "Update user's profile error")
    }
    const allow = ["name", "city", "country", "avatarUrl", "address", "numberOfPhone"]
    allow.forEach((field) => {
        if (body[field] !== undefined) {
            user[field] = body[field];
        }
    })
    await user.save();

    return sendResponse(res, 200, true, user, null, "Update profile successful")
});

controllerUser.changePassword = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    let { password, newPassword } = req.body;
    if (password === newPassword) {
        throw new AppError(500, "The new password must be different from the old password")
    }

    const user = await User.findOne({ _id: currentUserId, isDeleted: false }, "+password");
    if (!user) {
        throw new AppError(404, "User not found", "Change password error")
    };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError(400, " Wrong password", "Change password error")
    }
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt)

    user.password = newPassword;
    await user.save();
    return sendResponse(res, 200, true, { user }, null, "Change password successful")
})

controllerUser.deactivateAccount = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const user = await User.findOneAndUpdate(
        { currentUserId, isDeleted: false },
        { isDeleted: true },
        { new: true }
    )
    if (!user) {
        throw new AppError(404, "User not found", "Deactivate user error")
    }
    return sendResponse(res, 200, true, user, null, "Deactivate successful")
})

// filter 10 new users to donate a gift
// controllerUser.getUsersByAdmin = catchAsync(async (req, res, next) => {
//     let {limit, page} = 

//     return sendResponse(res, 200, true, {}, null, "Get users successful")
// })

module.exports = controllerUser;