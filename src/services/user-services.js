import createHttpError from 'http-errors';
import UsersCollection from '../database/models/user-schema.js';
import SessionCollection from '../database/models/session-schema.js';
import { hashPassword, compareHash } from '../utils/hash.js';
import { createSession } from './session-service.js';

export const findUser = (filter) => UsersCollection.findOne(filter);

export const userRegister = async ({ name, email, password }) => {
  const encriptedPassword = await hashPassword(password, 2);

  const register = await UsersCollection.create({
    name,
    email,
    password: encriptedPassword,
  });

  const autoLogin = await UsersCollection.findOne({
    email: register.email,
  });

  return {
    userId: autoLogin._id,
    name: autoLogin.name,
    email: autoLogin.email,
  };
};

export const userLogin = async ({ email, password }) => {
  const existingUser = await UsersCollection.findOne({ email });

  const comparePassword = await compareHash(password, existingUser.password);
  if (!comparePassword) {
    throw createHttpError(401, 'Password invalid');
  }

  return {
    userId: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
  };
};

export const userRefresh = async ({ _id, userId }) => {
  const currentSession = await createSession({ sessionId: _id, userId });

  return currentSession;
};

export const userLogout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};
