const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ordersSchema = Schema(
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
        amount: { type: Number, require: true },
        address: { type: Object, require: true },
        status: { type: String, default: "pending" }
    },
    { timestamps: true }
);

const Orders = mongoose.model("Orders", ordersSchema);

module.exports = Orders;