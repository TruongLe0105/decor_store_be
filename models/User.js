const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userChema = Schema({
    userName: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true, select: false },
    isAdmin: { type: Boolean, default: false, },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    avatarUrl: { type: String },
    numberOfPhone: { type: Number },
    isDeleted: { type: Boolean, default: false, select: false }
},
    { timestamps: true }
)

userChema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.password;
    delete obj.isDeleted;
    return obj;
}

userChema.methods.generateToken = function () {
    const accessToken = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, JWT_SECRET_KEY, {
        expiresIn: "1d",
    });
    return accessToken;
}

const User = mongoose.model("Users", userChema)
module.exports = User;