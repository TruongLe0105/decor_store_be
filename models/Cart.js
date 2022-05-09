const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "Users", require: true },
        products: [
            {
                productId:
                {
                    type: Schema.Types.ObjectId,
                    ref: "Products",
                    require: true
                },
                quantity: { type: Number, default: 1, require: true },
            }
        ],
    },
    { timestamps: true }
);

const Cart = mongoose.model("Carts", cartSchema);

module.exports = Cart;