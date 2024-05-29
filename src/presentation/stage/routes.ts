import { Router } from 'express';
import { StageController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { StageService } from '../services';

export class StageRoutes {
  static get routes(): Router {

    const router = Router();
    const stageService = new StageService();
    const controller = new StageController(stageService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getStages );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createStage );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateStage );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteStage )
    return router;
  }
}

