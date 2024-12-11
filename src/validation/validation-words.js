import Joi from 'joi';

import { EngRegExp, UaRegExp } from '../constants/words.js';
import { kind } from 'openai/_shims/index.mjs';

export const validationWords = Joi.object({
  en: Joi.string().pattern(EngRegExp).required(),
  ua: Joi.string().pattern(UaRegExp).required(),
  category: Joi.string(),
  isIrregular: Joi.boolean(),
  owner: Joi.string(),
  addedBy: Joi.string(),
  progress: Joi.string(),
});

export const validationAddWords = Joi.object({
  en: Joi.string().pattern(EngRegExp).required(),
  ua: Joi.string().pattern(UaRegExp).required(),
  category: Joi.string(),
  isIrregular: Joi.boolean(),
  owner: Joi.string(),
  addedBy: Joi.string(),
  progress: Joi.string(),
});

export const validationUpdateWords = Joi.object({
  en: Joi.string().pattern(EngRegExp),
  ua: Joi.string().pattern(UaRegExp),
  category: Joi.string(),
  isIrregular: Joi.boolean(),
  owner: Joi.string(),
  addedBy: Joi.string(),
  progress: Joi.string(),
});

export const validationAssistant = Joi.object({
  word: Joi.string().required(),
  targetLanguage: Joi.string().required(),
});

export const validationAnswers = Joi.object({
  tasksId: Joi.string().required(),
  ua: Joi.string().required(),
  en: Joi.string().required(),
  task: Joi.string().required(),
});
