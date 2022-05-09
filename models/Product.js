const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema({
    name: { type: String, require: true, unique: true },
    categories: { type: Array },
    description: { type: String, require: true },
    image: { type: String, require: true },
    price: { type: String, require: true },
    size: { type: String },
    // quantity: { type: Number, require: false },
    // purchases: { type: String, require: false } //Lượt mua
},
    { timestamps: true }
);

const Product = mongoose.model("Products", productSchema);

module.exports = Product;