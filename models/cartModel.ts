// My biggest task yet

import mongoose, { Document, Model, Types } from "mongoose";
import { IProduct } from "./productModel";

interface ICart extends Document {
  quantity: number;
  totalPrice: number;

  user?: Types.ObjectId;
  product?: Types.ObjectId;
  createdAt: Date;
}

const cartSchema = new mongoose.Schema<ICart>({
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

cartSchema.pre(/^find/, function (this: ICart & Model<ICart>, next) {
  this.populate<{ product: IProduct }>({
    path: "product",
    select: "name price image description",
  });

  next();
});

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
