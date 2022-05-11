const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = Schema(
    {
        customer: { type: Schema.Types.ObjectId, ref: "Users", require: true },
        products: [
            {
                _id: { type: Schema.Types.ObjectId, require: true },
                name: { type: String, require: true, unique: true },
                price: { type: Number, require: true },
                images: [{ imageUrl: { type: String, require: true } }],
                quantity: { type: Number, default: 1, require: true },
            }
        ],
        isDeleted: { type: Boolean, default: false, select: false },
        totalPrice: { type: Number, require: true }
    },
    { timestamps: true }
);

// cartSchema.plugin(require("./plugins/isDeletedFalse"));

const Cart = mongoose.model("Carts", cartSchema);

module.exports = Cart;