import mongoose, { Document, Types } from "mongoose";

interface IProduct {
  productId: mongoose.Schema.Types.ObjectId;

  price: number;
  quantity: number;
}

interface IOrder extends Document {
  createdAt: Date;

  products: Types.DocumentArray<IProduct>;

  totalPrice: number;
  user?: mongoose.Schema.Types.ObjectId;
  paid: boolean;
}

const orderSchema = new mongoose.Schema<IOrder>({
  createdAt: {
    type: Date,
    default: Date.now(),
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "Order must have a product"],
      },

      price: {
        type: Number,
        required: [true, "A product must have a price"],
      },

      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],

  totalPrice: {
    type: Number,
    required: [true, "An order must have a total price"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Order must belog to a user"],
  },

  paid: {
    type: Boolean,
    default: true,
  },
});

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
