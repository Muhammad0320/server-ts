import mongoose, { Document, Model } from "mongoose";

import User from "./userModel";

interface IReviews extends Document {
  review: string;

  rating: number;

  user?: mongoose.Schema.Types.ObjectId;

  product?: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const reviewSchema = new mongoose.Schema<IReviews>({
  review: {
    type: String,
    trim: true,
    required: [true, "Review field is required"],
  },

  rating: {
    type: Number,
    min: [1, "Rating should be above or equals to 1"],
    max: [5, "Rating should be below or equals 5"],
    required: [true, "Review should have a rating!"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Review must belong to a user"],
  },

  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: [true, "Review must be written about a product"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

reviewSchema.pre(/^find/, function (this: IReviews & Model<IReviews>, next) {
  this.populate<{ user: typeof User }>({ path: "user", select: "name photo" });

  next();
});

reviewSchema.set("toJSON", { getters: true, virtuals: true });
reviewSchema.set("toObject", { getters: true, virtuals: true });

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
