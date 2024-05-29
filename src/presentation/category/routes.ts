import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services';

export class CategoryRoutes {
  static get routes(): Router {

    const router = Router();
    const categoryService = new CategoryService();
    const controller = new CategoryController(categoryService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getCategories );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createCategory );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateCategory );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteCategory )
    return router;
  }
}

