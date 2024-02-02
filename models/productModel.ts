import { Document } from "mongoose";
import mongoose, { Types } from "mongoose";
import { ProductTypes } from "../utils/ProductCategories";

interface ProductIncludes {
  quantity: number;
  item: string;
}

interface ProductGallery {
  first: string;
  second: string;
  third: string;
}

interface ProductOthers {
  slug: string;
  name: string;
  image: string;
}

export interface IProduct extends Document {
  name: string;
  image: string;
  category: ProductTypes;
  createdAt: Date;
  new: Boolean;
  price: number;
  discountPrice: number;
  description: string;

  includes: Types.DocumentArray<ProductIncludes>;

  features: string;
  gallery: Types.DocumentArray<ProductGallery>;
  slug: string;

  others: Types.DocumentArray<ProductOthers>;

  ratingsAverage: number;
  ratingsQuantity: number;
  discountPercent: number;
  reviews: mongoose.Schema.Types.ObjectId;
}

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    minlength: [4, "Products name should have at least 4 chars"],
    trim: true,
    required: [true, "A product must have a name"],
  },

  image: {
    type: String,
    required: [true, "A product must have an image"],
  },

  category: {
    type: String,
    required: [true, "A product must belong to a category"],
    enum: [
      ProductTypes.earphone,
      ProductTypes.headphones,
      ProductTypes.speaker,
    ],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  new: {
    type: Boolean,
  },

  price: {
    type: Number,
    required: [true, "A product must have a price"],
  },

  discountPrice: {
    type: Number,
    validate: {
      validator: function (val) {
        return this.price > val;
      },

      message: "Discount price  should be less than regular prices",
    },
  },

  description: {
    type: String,
    trim: true,
    required: [true, "A product must have a description"],
  },

  includes: [
    {
      quantity: {
        type: Number,
        min: [1, "An item must have at least one quantity"],
      },

      item: {
        type: String,
        trim: true,
        maxlength: [40, "Item characters must be less or equal than 40"],
      },
    },
  ],

  features: {
    type: String,
    trim: true,
    required: [
      true,
      "A product have to possess some features, if not what is the point of your sales",
    ],
  },

  gallery: {
    first: String,
    second: String,
    third: String,
  },

  slug: {
    type: String,
    trim: true,
  },

  others: [
    {
      slug: {
        type: String,
        trim: true,
      },

      name: {
        type: String,
        required: true,
      },

      image: String,
    },
  ],

  ratingsAverage: {
    type: Number,
    default: 4.5,
    max: [5, "RatingAverage should not be above 5"],
    min: [1, "RatingsAverage should not be below 1 "],
  },

  ratingsQuantity: {
    type: Number,
    default: 0,
  },
});

productSchema.set("toJSON", { getters: true, virtuals: true });
productSchema.set("toObject", { getters: true, virtuals: true });

productSchema.virtual("discountPercent").get(function () {
  return (this.discountPrice / this.price) * 100;
});

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

productSchema.index({ category: 1, price: 1 });

productSchema.index({ slug: 1 });

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
