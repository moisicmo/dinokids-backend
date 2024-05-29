import { Router } from 'express';
import { ProjectController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ProjectService } from '../services';

export class ProjectRoutes {
  static get routes(): Router {
    const router = Router();
    const projectService = new ProjectService();
    const controller = new ProjectController(projectService);

    router.use(AuthMiddleware.validateJWT);
    // rutas
    router.get('/',controller.getProjects);
    router.get('/xlsx/:id',controller.getDocumentXlsx)
    router.post('/', controller.createProject);
    router.put('/:id', controller.updateProject);
    router.delete(
      '/:id',
      controller.deleteProject
    );
    
    return router;
  }
}
