import { Router } from 'express';
import { createMonthlyFeeCtrl, updateMonthlyFeeCtrl, findOneMonthlyFeeCtrl,deleteMonthlyFeeCtrl } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class MonthlyFeeRoutes {
  static get routes(): Router {

    const router = Router();

    // rutas
   // router.get( '/', [ AuthMiddleware.validateJWT ],findPricesCtrl );
    router.get( '/:id', [ AuthMiddleware.validateJWT ],findOneMonthlyFeeCtrl );
    router.post( '/',[ AuthMiddleware.validateJWT ],createMonthlyFeeCtrl );
    router.put( '/:id',[AuthMiddleware.validateJWT], updateMonthlyFeeCtrl );
    router.delete( '/:id',[AuthMiddleware.validateJWT], deleteMonthlyFeeCtrl );
    // price/clasees
   // router.get( '/classes/:id', [ AuthMiddleware.validateJWT ], findPricesByClassesIdCtrl );

    return router;
  }
}

