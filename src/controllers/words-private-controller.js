import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

import {
  addWordToUserCollection,
  updateSelfWord,
  findUserWords,
  deletePrivateWord,
  getAllPrivateWords,
  studyTasks,
  findTasks,
  usersAnswer,
} from '../services/user-word-service.js';

import { TasksCollection } from '../database/models/tasks-schema.js';

import { findPublicWord } from '../services/public-words-service.js';
import { env } from '../utils/env.js';
import { findUser } from '../services/user-services.js';

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
  if (addedWord) {
    await TasksCollection.create({
      ua: addedWord.ua,
      task: 'en',
      wordId: addedWord._id,
      userId: user._id,
    });
  }

  res.status(200).json({
    status: 200,
    message: 'Your collection is growth',
    data: addedWord,
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

export const getUserTasks = async (req, res) => {
  const { refreshToken } = req.cookies;

  const { userId, exp } = await jwt.verify(refreshToken, env('JWT_SECRET'));
  if (Date.now() > exp * 1000) {
    throw createHttpError(401, 'Unauthorized');
  }

  const isUser = await findUser({
    _id: userId,
  });
  if (!isUser) {
    throw createHttpError(404, 'User not found');
  }

  const isUsersTask = await findTasks({ userId: isUser._id });
  if (!isUsersTask) {
    404, 'Task not found';
  }

  const getUsersTasks = await studyTasks({ userId: isUsersTask.userId });

  res.status(200).json({
    status: 200,
    message: 'Your tasks',
    tasks: getUsersTasks,
  });
};

export const usersAnswerController = async (req, res) => {
  const { tasksId, en, ua, task } = req.body;

  const response = await usersAnswer({
    tasksId,
    en,
    ua,
    task,
  });

  res.status(200).json({
    status: 200,
    message: 'Take your answer',
    answer: response,
  });
};
