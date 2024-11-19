import jwt from 'jsonwebtoken';
import { ACCESS_TOKET_LIFETIME, REFRESH_TOKEN_LIFETIME } from '../constants/user.js';

import SessionCollection from '../database/models/session-schema.js';
import { env } from '../utils/env.js';

const jwt_secret = env('JWT_SECRET');

export const findSession = (filter) => SessionCollection.findOne(filter);

export const deleteSession = (filter) => SessionCollection.deleteOne(filter);

export const createSession = async ({ sessionId, userId }) => {
  if (sessionId) {
    await SessionCollection.deleteOne({ _id: sessionId });
  }

  const payload = {
    // userId,
    // email,
  };

  const accessToken = jwt.sign(payload, jwt_secret, { expiresIn: ACCESS_TOKET_LIFETIME });
  const refreshToken = jwt.sign(payload, jwt_secret, { expiresIn: REFRESH_TOKEN_LIFETIME });
  const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKET_LIFETIME);
  const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_LIFETIME);

  return await SessionCollection.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};
