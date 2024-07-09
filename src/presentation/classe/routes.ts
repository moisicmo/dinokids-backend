import { Router } from 'express';
import { ClasseController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ClasseService } from '../services';

export class ClasseRoutes {
  static get routes(): Router {

    const router = Router();
    const classesService = new ClasseService();
    const controller = new ClasseController(classesService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getClasses );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createClasses );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateClasses );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteClasses )
    return router;
  }
}

