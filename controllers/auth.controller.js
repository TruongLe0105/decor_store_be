const bcrypt = require("bcryptjs");
const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Cart = require("../models/Cart");
const User = require("../models/User");

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
    }

    const accessToken = user.generateToken()

    return sendResponse(
        res,
        200,
        true,
        { user, cart, accessToken },
        null,
        "Login successful")
});

module.exports = controllerAuth;
