import { model, Schema } from 'mongoose';

import { categories } from '../../constants/categories.js';

const CategoriesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: categories,
    },
  },
  { timestamps: true, versionKey: false },
);

export const CategoriesCollection = model('categorie', CategoriesSchema);
