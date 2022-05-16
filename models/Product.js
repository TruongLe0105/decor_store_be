const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema({
    name: { type: String, require: true, unique: true },
    categories: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    price: { type: Number, require: true },
    isDeleted: { type: Boolean, default: false, select: false },
},
    { timestamps: true }
);

// productSchema.plugin(require("./plugins/isDeletedFalse"));

const Product = mongoose.model("Products", productSchema);

module.exports = Product;