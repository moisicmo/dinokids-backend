import { Router } from 'express';
import { TypeProjectController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService, TypeProjectService } from '../services';

export class TypeProjectRoutes {
  static get routes(): Router {

    const router = Router();
    const typeProjectService = new TypeProjectService();
    const controller = new TypeProjectController(typeProjectService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getTypeProjects );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createTypeProject );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateTypeProject );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteTypeProject )
    return router;
  }
}

