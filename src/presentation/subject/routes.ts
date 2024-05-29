import { Router } from 'express';
import { SubjectController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { SubjectService } from '../services';

export class SubjectRoutes {
  static get routes(): Router {

    const router = Router();
    const subjectService = new SubjectService();
    const controller = new SubjectController(subjectService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getSubjects );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createSubject );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateSubject );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteSubject )
    return router;
  }
}

