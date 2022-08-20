import express, { Router } from 'express';
import AuthController from '../authentication/authController';
import UserController from './userController';

const router = express.Router();

router.post('/users', UserController.create);
router.get('/users', AuthController.getAll);
router.get('/users/:id', UserController.getOne);
router.put('/users', AuthController.update);
router.delete('/users/:id', UserController.delete);

export default router;
