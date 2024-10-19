import { Router } from 'express';
import { createPriceCtrl, findPricesCtrl, findOnePriceCtrl, updatePriceCtrl, deletePriceCtrl, findPricesByClassesIdCtrl } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { StaffService } from '../services';

export class PriceRoutes {
  static get routes(): Router {

    const router = Router();

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],findPricesCtrl );
    router.get( '/:id', [ AuthMiddleware.validateJWT ],findOnePriceCtrl );
    router.post( '/',[ AuthMiddleware.validateJWT ],createPriceCtrl );
    router.put( '/:id',[AuthMiddleware.validateJWT], updatePriceCtrl );
    router.delete( '/:id',[AuthMiddleware.validateJWT], deletePriceCtrl );
    // price/clasees
    router.get( '/classes/:id', [ AuthMiddleware.validateJWT ], findPricesByClassesIdCtrl );

    return router;
  }
}

