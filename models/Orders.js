const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ordersSchema = Schema(
    {
        user: { type: Schema.Types.ObjectId, require: true, default: false },
        cartProducts: [
            // {
            //     productId: { type: Schema.Types.ObjectId, require: true, default: false },
            //     quantity: { type: Number, require: true, default: false },
            // },
        ],
        totalPrice: { type: Number, require: true, default: false },
        numberOfPhone: { type: String, require: true, default: false },
        receiver: { type: String, require: true, default: false },
        address: { type: String, require: true, default: false },
        status: { type: String, enum: ["pending", "shipping", "completed", "declined"], default: "pending" },
        isDeleted: { type: Boolean, default: false, select: false }
    },
    { timestamps: true }
);

// ordersSchema.plugin(require("./plugins/isDeletedFalse"));

const Orders = mongoose.model("Orders", ordersSchema);

module.exports = Orders;