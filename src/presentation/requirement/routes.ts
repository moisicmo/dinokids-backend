import { Router } from 'express';
import { RequirementController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RequirementService } from '../services';

export class RequirementRoutes {
  static get routes(): Router {

    const router = Router();
    const requirementService = new RequirementService();
    const controller = new RequirementController(requirementService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getRequirements );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createRequirement );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateRequirement );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteRequirement )
    return router;
  }
}

