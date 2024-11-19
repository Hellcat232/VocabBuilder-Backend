import { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, reqiured: true },
    refreshTokenValidUntil: { type: Date, reqiured: true },
  },
  { versionKey: false, timestamps: true },
);

const SessionCollection = model('session', sessionSchema);

export default SessionCollection;
