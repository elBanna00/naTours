import * as express from 'express';
// @ts-ignore
import * as userController from '../controllers/userController.ts';
// import fs from 'fs';
const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
