import express, { Router } from 'express';
import UserController from './userController';

const router = express.Router();

router.post('/users', UserController.create);
router.get('/users', UserController.getAll);
router.get('/users/:id', UserController.getOne);
router.put('/users', UserController.update);
router.delete('/users/:id', UserController.delete);

export default router;
