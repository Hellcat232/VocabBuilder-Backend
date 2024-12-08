import jwt from 'jsonwebtoken';

import {
  getCategories,
  createWord,
  findPublicWord,
  updateWord,
  getAllPablicWords,
} from '../services/public-words-service.js';

import {
  addWordToUserCollection,
  updateSelfWord,
  findUserWords,
  deletePrivateWord,
  getAllPrivateWords,
} from '../services/user-word-service.js';
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

export const addWordToUserCollectionController = async (req, res) => {
  const { id } = req.params;
  const { refreshToken } = req.cookies;

  const { userId, exp } = await jwt.verify(refreshToken, env('JWT_SECRET'));
  if (Date.now() > exp * 1000) {
    throw createHttpError(401, 'Unauthorized');
  }

  const user = await findUser({ _id: userId });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const lookForPublicWord = await findPublicWord({ _id: id });
  if (!lookForPublicWord) {
    throw createHttpError(404, 'Word not found');
  }

  const addedWord = await addWordToUserCollection(lookForPublicWord);

  res.status(200).json({
    status: 200,
    message: 'Your collection is growth',
    data: addedWord,
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

export const updateSelfWordController = async (req, res) => {
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

  const findUserWord = await findUserWords({ _id: id });
  if (!findUserWord) {
    throw createHttpError(404, 'Not found this word in your collection');
  }

  const editedSelf = await updateSelfWord(findUserWord, { data, userId: user._id });

  res.status(200).json({
    status: 200,
    message: 'Your word was updated',
    data: editedSelf,
  });
};

export const deletePrivateWordController = async (req, res) => {
  const { id } = req.params;
  const { refreshToken } = req.cookies;

  const { userId, exp } = await jwt.verify(refreshToken, env('JWT_SECRET'));
  if (Date.now() > exp * 1000) {
    throw createHttpError(401, 'Unauthorized');
  }

  const isUser = await findUser({ _id: userId });
  if (!isUser) {
    throw createHttpError(404, 'User not found');
  }

  const word = await findUserWords({ _id: id });
  if (!word) {
    throw createHttpError(404, 'Not found word');
  }

  const deletedWord = await deletePrivateWord({ _id: word._id });

  res.status(204).json({
    status: 204,
    message: 'Word was deleted from you collection',
    data: deletedWord,
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

export const getAllPrivateWordsController = async (req, res) => {
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

  const getPrivateWords = await getAllPrivateWords({ page, perPage });

  res.status(200).json({
    status: 200,
    message: 'Get your words collection',
    data: getPrivateWords,
  });
};
