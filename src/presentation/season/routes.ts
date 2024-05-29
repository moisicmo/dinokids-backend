import { Router } from 'express';
import { SeasonController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { SeasonService } from '../services';

export class SeasonRoutes {
  static get routes(): Router {
    const router = Router();
    const seasonService = new SeasonService();
    const controller = new SeasonController(seasonService);

    // rutas
    router.get('/enable', [AuthMiddleware.validateJWT], controller.getSeasonEnable);
    router.get('/', [AuthMiddleware.validateJWT], controller.getSeasons);
    router.post('/', [AuthMiddleware.validateJWT], controller.createSeason);
    router.put('/:id', [AuthMiddleware.validateJWT], controller.updateSeason);
    router.delete(
      '/:id',
      [AuthMiddleware.validateJWT],
      controller.deleteSeason
    );
    router.put(
      '/enable/:id',
      [AuthMiddleware.validateJWT],
      controller.enableSeason
    );
    return router;
  }
}
