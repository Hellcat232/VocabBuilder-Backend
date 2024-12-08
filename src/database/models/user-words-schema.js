import { model, Schema } from 'mongoose';

import { EngRegExp, UaRegExp } from '../../constants/words.js';

const UserWordsSchema = new Schema(
  {
    en: { type: String, match: EngRegExp, required: true },
    ua: { type: String, match: UaRegExp, required: true },
    category: { type: String },
    isIrregular: { type: Boolean, default: 'false' },
    owner: { type: Schema.Types.ObjectId, ref: 'public-word' },
    addedBy: { type: String },
    progress: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

export const UserWordsCollection = model('user-word', UserWordsSchema);
