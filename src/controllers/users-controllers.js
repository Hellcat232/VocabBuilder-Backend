import createHttpError from 'http-errors';

import {
  userRegister,
  userLogin,
  findUser,
  userRefresh,
  userLogout,
} from '../services/user-services.js';
import { createSession, findSession, deleteSession } from '../services/session-service.js';

export const userRegisterController = async (req, res) => {
  const userValue = req.body;

  const user = await findUser({ email: userValue.email });
  if (user) {
    throw createHttpError(409, 'Such email already exists');
  }

  const newUser = await userRegister(userValue);

  const session = await createSession({
    userId: newUser.userId,
  });

  res.cookie('sessionId', session._id, { httpOnly: true, expires: session.refreshTokenValidUntil });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(201).json({
    status: 201,
    message: 'User was created!',
    data: {
      name: newUser.name,
      email: newUser.email,
      accessToken: session.accessToken,
    },
  });
};

export const userLoginController = async (req, res) => {
  const userEmail = req.body;
  const { sessionId } = req.cookies;

  const isUser = await findUser({ email: userEmail.email });
  if (!isUser) {
    throw createHttpError(404, `User with email ${userEmail.email} not found! Try register page!`);
  }

  const currentUser = await userLogin(userEmail);

  const newSession = await createSession({ sessionId: sessionId, userId: currentUser.userId });

  res.cookie('sessionId', newSession._id, {
    httpOnly: true,
    expires: newSession.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', newSession.refreshToken, {
    httpOnly: true,
    expires: newSession.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'User login success',
    data: {
      name: currentUser.name,
      email: currentUser.email,
      accessToken: newSession.accessToken,
    },
  });
};

export const userRefreshController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  const currentSession = await findSession({ _id: sessionId, refreshToken });
  if (!currentSession) {
    throw createHttpError(404, 'Session not found');
  }

  const isExpiredSession = new Date() > new Date(currentSession.refreshTokenValidUntil);
  if (isExpiredSession) {
    await deleteSession(sessionId);
    throw createHttpError(401, 'Session expired');
  }

  let currentUser;

  const newSession = await userRefresh(currentSession);
  if (newSession) {
    currentUser = await findUser(newSession.userId);
  }

  // console.log(currentUser);

  res.cookie('sessionId', newSession._id, {
    httpOnly: true,
    expires: newSession.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', newSession.refreshToken, {
    httpOnly: true,
    expires: newSession.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Refresh successfully!',
    data: {
      name: currentUser.name,
      email: currentUser.email,
      accessToken: newSession.accessToken,
    },
  });
};

export const userLogoutController = async (req, res) => {
  const { sessionId } = req.cookies;

  const session = await findSession({ _id: sessionId });
  if (!session) {
    throw createHttpError(401, 'User not authorized');
  }

  await userLogout(sessionId);

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
