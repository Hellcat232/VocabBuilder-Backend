import { model, Schema } from 'mongoose';

import { emailRegExp, passwordRegExp } from '../../constants/user.js';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, match: emailRegExp, required: true },
    password: { type: String, required: true },
  },
  { versionKey: false, timestamps: true },
);

const UsersCollection = model('user', userSchema);

export default UsersCollection;
