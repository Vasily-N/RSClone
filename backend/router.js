import { Router } from 'express';
// import postController from './postController.js';
// import Post from './post.js';
import PostController from './postController.js';

const router = new Router();

router.post('/posts', PostController.create);
router.get('/posts', PostController.getAll);
router.get('/posts/:id', PostController.getOne);
router.put('/posts', PostController.update);
router.delete('/posts/:id', PostController.delete);

export default router;
