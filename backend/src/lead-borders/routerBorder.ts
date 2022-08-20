import express, { Router } from 'express';
import BorderController from './borderController';

const routerBorder = express.Router();

routerBorder.post('/times', BorderController.create);
routerBorder.get('/times', BorderController.getAll);
routerBorder.get('/times/:id', BorderController.getOne);
routerBorder.put('/times', BorderController.update);
routerBorder.delete('/times/:id', BorderController.delete);

export default routerBorder;
