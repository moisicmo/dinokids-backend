import { Router } from 'express';
import { SpecialtyController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { SpecialtyService } from '../services';

export class SpecialtyRoutes {
  static get routes(): Router {

    const router = Router();
    const moduleService = new SpecialtyService();
    const controller = new SpecialtyController(moduleService);

    // rutas
    router.get( '/branch/:branchId', [ AuthMiddleware.validateJWT ],controller.getSpecialtiesbyBranch );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createSpecialty );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateSpecialty );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteSpecialty )
    return router;
  }
}

