import { Router } from 'express';
import { createMonthlyFeeCtrl, updateMonthlyFeeCtrl, findOneMonthlyFeeCtrl,deleteMonthlyFeeCtrl, findMonthlyFeesCtrl,createInscriptionFeeCtrl } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class MonthlyFeeRoutes {
  static get routes(): Router {

    const router = Router();

    // rutas
   // 
    router.get( '/', [ AuthMiddleware.validateJWT ],findMonthlyFeesCtrl );
    router.get( '/:id', [ AuthMiddleware.validateJWT ],findOneMonthlyFeeCtrl );
    router.post( '/',[ AuthMiddleware.validateJWT ],createMonthlyFeeCtrl );
    router.post( '/inscription/',[ AuthMiddleware.validateJWT ],createInscriptionFeeCtrl );
    router.put( '/:id',[AuthMiddleware.validateJWT], updateMonthlyFeeCtrl );
    router.delete( '/:id',[AuthMiddleware.validateJWT], deleteMonthlyFeeCtrl );
    // price/clasees
   // router.get( '/classes/:id', [ AuthMiddleware.validateJWT ], findPricesByClassesIdCtrl );

    return router;
  }
}

