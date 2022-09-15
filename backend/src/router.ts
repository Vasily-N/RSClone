import express, { Router } from 'express';
import AuthController from './authentication/authController';
import TimeController from './lead-borders/timeController';
import WinController from './lead-borders/winController';
import UserController from './registration/userController';

const router = express.Router();

router.post('/users', UserController.create);
router.get('/users', AuthController.getAll);
router.get('/users/:id', UserController.getOne);
router.put('/users', AuthController.update);
router.delete('/users/:id', UserController.delete);

router.post('/times', TimeController.create);
router.get('/times', TimeController.getAll);
router.get('/times/:id', TimeController.getOne);
router.put('/times', TimeController.update);
router.delete('/times/:id', TimeController.delete);

router.post('/wins', WinController.create);
router.get('/wins', WinController.getAll);
router.get('/wins/:id', WinController.getOne);
router.put('/wins', WinController.update);
router.delete('/wins/:id', WinController.delete);

export default router;
