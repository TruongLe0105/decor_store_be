const bcrypt = require("bcryptjs");
const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const User = require("../models/User");

const controllerUser = {};
controllerUser.register = catchAsync(async (req, res, next) => {
    let { firstName, lastName, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
        throw new AppError(409, "User already exists", "Register error")
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt)

    user = await User.create({
        firstName,
        lastName,
        email,
        password
    });

    const accessToken = user.generateToken()

    return sendResponse(res, 200, true, { user, accessToken }, null, "Register successful")
});

controllerUser.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    console.log("body", password)
    const user = await User.findOne({ email, isDeleted: false }, "+password");

    if (!user) {
        throw new AppError(404, "User not found", "Login error")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new AppError(400, "Wrong password", "Login error")
    }
    const accessToken = user.generateToken()
    return sendResponse(res, 200, true, { user, accessToken }, null, "Login successful")
});

controllerUser.getCurrentUserProfile = catchAsync(async (req, res, next) => {
    const { currentUserId } = req;
    const user = await User.findOne({ _id: currentUserId, isDeleted: false })
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
    const allow = ["firstName", "avatarUrl", "lastName", "address", "city", "numberOfPhone"]
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

module.exports = controllerUser;