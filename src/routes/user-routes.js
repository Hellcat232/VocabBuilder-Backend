import express from 'express';
import {
  userRegisterController,
  userLoginController,
  userRefreshController,
  userLogoutController,
} from '../controllers/users-controllers.js';

import { validationLoginUser, validationRegisterUser } from '../validation/validation-user.js';

import { validateBody } from '../utils/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const userRoute = express.Router();

userRoute.post(
  '/signup',
  validateBody(validationRegisterUser),
  ctrlWrapper(userRegisterController),
);

userRoute.post('/signin', validateBody(validationLoginUser), ctrlWrapper(userLoginController));

userRoute.post('/current', ctrlWrapper(userRefreshController));

userRoute.post('/logout', ctrlWrapper(userLogoutController));

export default userRoute;
