import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import multer from 'multer';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions/', SessionController.store);
routes.post('/users/', UserController.store);
routes.put('/users/', authMiddleware, UserController.update);
routes.post('/files/', upload.single('file'), (req, res) => {
  return res.json(req.file);
});

export default routes;