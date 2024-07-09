import { Router } from 'express';
import { ModuleController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ModuleService } from '../services';

export class ModuleRoutes {
  static get routes(): Router {

    const router = Router();
    const moduleService = new ModuleService();
    const controller = new ModuleController(moduleService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getModules );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createModule );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateModule );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteModule )
    return router;
  }
}

