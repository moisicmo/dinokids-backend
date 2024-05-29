import { Router } from 'express';
import { InscriptionController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { InscriptionService } from '../services';

export class InscriptionRoutes {
  static get routes(): Router {

    const router = Router();
    const inscriptionService = new InscriptionService();
    const controller = new InscriptionController(inscriptionService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getInscriptions );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createInscription );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateInscription );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteInscription )
    return router;
  }
}

