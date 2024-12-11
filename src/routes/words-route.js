import express from 'express';

import {
  getCategoriesController,
  createWordController,
  updateWordController,
  getAllPablicWordsController,
  askChatController,
} from '../controllers/words-public-controller.js';

import {
  addWordToUserCollectionController,
  getAllPrivateWordsController,
  updateSelfWordController,
  deletePrivateWordController,
  getUserTasks,
  usersAnswerController,
} from '../controllers/words-private-controller.js';

import { validateBody } from '../utils/validateBody.js';
import {
  validationWords,
  validationAddWords,
  validationUpdateWords,
  validationAssistant,
  validationAnswers,
} from '../validation/validation-words.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const wordsRoute = express.Router();

wordsRoute.get('/categories', ctrlWrapper(getCategoriesController));

wordsRoute.post('/create', validateBody(validationWords), ctrlWrapper(createWordController));

wordsRoute.post(
  '/add/:id',
  validateBody(validationAddWords),
  ctrlWrapper(addWordToUserCollectionController),
);

wordsRoute.patch(
  '/edit/:id',
  validateBody(validationUpdateWords),
  ctrlWrapper(updateWordController),
);

wordsRoute.patch(
  '/edit/user/:id',
  validateBody(validationUpdateWords),
  ctrlWrapper(updateSelfWordController),
);

wordsRoute.delete('/delete/:id', ctrlWrapper(deletePrivateWordController));

wordsRoute.get('/all', ctrlWrapper(getAllPablicWordsController));

wordsRoute.get('/own', ctrlWrapper(getAllPrivateWordsController));

wordsRoute.get('/statistics');

wordsRoute.get('/tasks', ctrlWrapper(getUserTasks));

wordsRoute.post('/answers', validateBody(validationAnswers), ctrlWrapper(usersAnswerController));

wordsRoute.post('/translate', validateBody(validationAssistant), ctrlWrapper(askChatController));

export default wordsRoute;
