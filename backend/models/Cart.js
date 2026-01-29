const mongoose = require("mongoose")
const CartItemSchema=mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        require: true
    },
    quantity: {
        type: Number,
        require: true
    }
})
const CartSchema=mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    items: [CartItemSchema]
})
module.exports=mongoose.model("Cart",CartSchema)