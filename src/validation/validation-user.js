import Joi from 'joi';
import { emailRegExp, passwordRegExp } from '../constants/user.js';

export const validationRegisterUser = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().pattern(passwordRegExp).required(),
});

export const validationLoginUser = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().pattern(passwordRegExp).required(),
});
