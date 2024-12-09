import jwt from 'jsonwebtoken';

import { askChat } from '../services/translate-service.js';

import {
  getCategories,
  createWord,
  findPublicWord,
  updateWord,
  getAllPablicWords,
} from '../services/public-words-service.js';

import { TasksCollection } from '../database/models/tasks-schema.js';

import { categories } from '../constants/categories.js';
import { findUser } from '../services/user-services.js';
import { env } from '../utils/env.js';
import createHttpError from 'http-errors';

export const getCategoriesController = async (req, res, next) => {
  const categoriesList = getCategories();

  res.status(200).json({
    status: 200,
    message: 'All categories list',
    data: categories,
  });
};

export const createWordController = async (req, res, next) => {
  const { en, ua, category, isIrregular } = req.body;
  const { refreshToken } = req.cookies;

  const { userId, exp } = await jwt.verify(refreshToken, env('JWT_SECRET'));
  if (Date.now() > exp * 1000) {
    throw createHttpError(401, 'Unauthorized');
  }

  const user = await findUser({ _id: userId });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const word = await createWord({
    en,
    ua,
    category,
    isIrregular,
    userId: user._id,
    addedBy: user.name,
  });

  res.status(200).json({
    status: 200,
    message: 'New word added',
    data: word,
  });
};

export const updateWordController = async (req, res) => {
  const { id } = req.params;
  const { refreshToken } = req.cookies;
  const data = req.body;

  const { userId, exp } = await jwt.verify(refreshToken, env('JWT_SECRET'));
  if (Date.now() > exp * 1000) {
    throw createHttpError(401, 'Unauthorized');
  }

  const user = await findUser({ _id: userId });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const findWord = await findPublicWord({ _id: id });
  if (!findWord) {
    throw createHttpError(404, 'Word not found');
  }

  const edited = await updateWord(findWord, data);

  res.status(200).json({
    status: 200,
    message: 'Word was updated',
    data: edited,
  });
};

export const getAllPablicWordsController = async (req, res) => {
  const { page, perPage } = req.query;
  const { refreshToken } = req.cookies;

  const { userId, exp } = await jwt.verify(refreshToken, env('JWT_SECRET'));
  if (Date.now() > exp * 1000) {
    throw createHttpError(401, 'Unauthorized');
  }

  const isUser = await findUser({ _id: userId });
  if (!isUser) {
    throw createHttpError(404, 'User not found');
  }

  const getAllWords = await getAllPablicWords({ page, perPage });

  res.status(200).json({
    status: 200,
    message: 'Got all pablic words',
    data: getAllWords,
  });
};

export const askChatController = async (req, res) => {
  const { word, targetLanguage } = req.body;

  if (!word && !targetLanguage) {
    throw createHttpError(400, 'Word and targetLanguage are required');
  }

  const assist = await askChat(word, targetLanguage);

  res.status(200).json({
    status: 200,
    message: 'Your word translated',
    data: assist,
  });
};
