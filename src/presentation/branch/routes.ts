import { Router } from 'express';
import { BranchController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { BranchService } from '../services';

export class BranchRoutes {
  static get routes(): Router {

    const router = Router();
    const branchService = new BranchService();
    const controller = new BranchController(branchService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getBranches );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createBranch );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateBranch );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteBranch )
    return router;
  }
}

