const bcrypt = require("bcryptjs");
const { SchemaTypes } = require("mongoose");
const { catchAsync, sendResponse, AppError, generateRandomHexString } = require("../helpers/utils");
const Cart = require("../models/Cart");
const User = require("../models/User");

const controllerUser = {};
controllerUser.register = catchAsync(async (req, res, next) => {
    let { userName, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
        throw new AppError(409, "User already exists", "Register error")
    };

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt)

    user = await User.create({
        userName,
        email,
        password,
    });

    let cart = await Cart.findOne({ user: user._id, isDeleted: false })
    if (cart) {
        throw new AppError(400, "Cart already exits", "Register error")
    }
    cart = await Cart.create({
        user: user._id,
        products: [],
    });
    user.cartId = cart._id;
    await user.save();

    const accessToken = user.generateToken()

    return sendResponse(res, 200, true, { user, cart, accessToken }, null, "Register successful")
});

controllerUser.getCurrentUserProfile = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const user = await User.findOne({ _id: currentUserId, isDeleted: false });

    if (!user) {
        throw new AppError(404, "User not found", "Get profile user error")
    };

    return sendResponse(res, 200, true, user, null, "Get profile successful")
});

controllerUser.updateCurrentProfile = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const body = req.body;
    let user = await User.findOne({ _id: currentUserId, isDeleted: false })
    if (!user) {
        throw new AppError(404, "User not found", "Update user's profile error")
    };

    const allow = ["fullName", "city", "country", "address", "avatarUrl", "numberOfPhone"];
    allow.forEach((field) => {
        if (body[field] !== undefined) {
            user[field] = body[field];
        };
    });

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
});

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
});


controllerUser.addNewAddress = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const { receiver, address, numberOfPhone } = req.body;
    if (!Number(numberOfPhone)) {
        throw new AppError(422, "Vui lòng nhập số điện thoại đúng!", "Lỗi thêm địa chỉ")
    }
    let user = await User.findOne({ _id: currentUserId, isDeleted: false })
    if (!user) {
        throw new AppError(404, "User not found", "Update order address error")
    };
    user.orderAddress.push({
        receiver,
        address,
        numberOfPhone,
    })

    await user.save();

    return sendResponse(res, 200, true, { user }, null, "Thêm địa chỉ thành công")
})

controllerUser.updateAddress = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const { receiver, address, numberOfPhone } = req.body;
    const { addressId } = req.params;

    if (!Number(numberOfPhone)) {
        throw new AppError(401, "Số điện thoại không đúng", "Update address error")
    }

    let user = await User.findOne({ _id: currentUserId, isDeleted: false })
    if (!user) {
        throw new AppError(404, "User not found", "Update order address error")
    };

    const found = user.orderAddress.find(address => address._id.equals(addressId));
    if (!found) {
        throw new AppError(404, "Địa chỉ không tìm thấy", "Update address error")
    }
    found.receiver = receiver,
        found.address = address,
        found.numberOfPhone = numberOfPhone

    await user.save();

    return sendResponse(res, 200, true, user, null, "Update address success!")
});

controllerUser.deleteAddress = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const { addressId } = req.params;
    console.log("addressId", addressId);
    let user = await User.findOne({ _id: currentUserId, isDeleted: false })
    if (!user) {
        throw new AppError(404, "User not found", "Update order address error")
    };

    const addressFound = user.orderAddress.find(address => address._id.equals(addressId));

    if (!addressFound) {
        throw new AppError(404, "Địa chỉ không tồn tại", "Delete address error!")
    };

    // user.orderAddress = user.orderAddress.filter(address => !address._id.equals(addressId));
    // user.orderAddress.pull(addressId);
    user = await User.findByIdAndUpdate(
        currentUserId,
        { $pull: { orderAddress: { _id: addressId } } },
    )
    await user.save();

    return sendResponse(res, 200, true, {}, null, "Delete address successful");
})

module.exports = controllerUser;