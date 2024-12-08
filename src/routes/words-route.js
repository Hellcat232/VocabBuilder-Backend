import express from 'express';

import {
  getCategoriesController,
  createWordController,
  addWordToUserCollectionController,
  updateWordController,
  updateSelfWordController,
  deletePrivateWordController,
} from '../controllers/words-controller.js';

import { validateBody } from '../utils/validateBody.js';
import {
  validationWords,
  validationAddWords,
  validationUpdateWords,
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

export default wordsRoute;
