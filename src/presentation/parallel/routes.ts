import { Router } from 'express';
import { ParallelController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ParallelService } from '../services';

export class ParallelRoutes {
  static get routes(): Router {

    const router = Router();
    const parallelService = new ParallelService();
    const controller = new ParallelController(parallelService);
    router.use(AuthMiddleware.validateJWT);
    // rutas
    router.get('/', controller.getParallels);
    router.post('/', controller.createParallel);
    router.put('/:id', controller.updateParallel);
    router.delete('/:id', controller.deleteParallel);

    // upload file
    router.post('/file', controller.createParallels);
    return router;
  }
}

