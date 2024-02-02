// My biggest task yet

import mongoose, { Types } from "mongoose";

interface Cart {
  quantity: number;
  total: number;

  user: Types.ObjectId;
  product: Types.ObjectId;
  createdt: Date;
}

const cartSchema = new mongoose.Schema<Cart>({
  quantity: {
    type: Number,
    default: 1,
  },

  totalPrice: {
    type: Number,
    required: [true, "A cart must have a total price"],
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A cart must belong to a user"],
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "A product must be added to cart"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "product",
    select: "name price image description",
  });

  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
