const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema({
    name: { type: String, require: true, default: "" },
    imageUrl: { type: String, require: true, default: "" },
    quantity: { type: Number, require: true, default: "" },
    categories: { type: String, require: false, default: "" },
    description: { type: String, require: false, default: "" },
    price: { type: Number, require: false, default: "" },
    isDeleted: { type: Boolean, default: false, select: false },
},
    { timestamps: true }
);

// productSchema.index({ name: "text", categories: "text" });

// productSchema.plugin(require("./plugins/isDeletedFalse"));

const Product = mongoose.model("Products", productSchema);

module.exports = Product;