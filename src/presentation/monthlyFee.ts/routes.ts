import { Router } from 'express';
import { createMonthlyFeeCtrl } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { StaffService } from '../services';

export class MonthlyFeeRoutes {
  static get routes(): Router {

    const router = Router();

    // rutas
   // router.get( '/', [ AuthMiddleware.validateJWT ],findPricesCtrl );
    //router.get( '/:id', [ AuthMiddleware.validateJWT ],findOnePriceCtrl );
    router.post( '/',[ AuthMiddleware.validateJWT ],createMonthlyFeeCtrl );
    //router.put( '/:id',[AuthMiddleware.validateJWT], updatePriceCtrl );
    //router.delete( '/:id',[AuthMiddleware.validateJWT], deletePriceCtrl );
    // price/clasees
   // router.get( '/classes/:id', [ AuthMiddleware.validateJWT ], findPricesByClassesIdCtrl );

    return router;
  }
}

