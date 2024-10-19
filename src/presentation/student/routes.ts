import { Router } from 'express';
import { StudentController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { StudentService } from '../services';

export class StudentRoutes {
  static get routes(): Router {

    const router = Router();
    const studentService = new StudentService();
    const controller = new StudentController(studentService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getStudents );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createStudent );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateStudent );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteStudent )
    return router;
  }
}

