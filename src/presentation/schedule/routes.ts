import { Router } from 'express';
import { ScheduleController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ScheduleService } from '../services';

export class ScheduleRoutes {
  static get routes(): Router {

    const router = Router();
    const scheduleService = new ScheduleService();
    const controller = new ScheduleController(scheduleService);

    // rutas
    router.get('/:id', [AuthMiddleware.validateJWT], controller.getSchedules);
    router.post('/', [AuthMiddleware.validateJWT], controller.createSchedule);
    router.put('/:id', [AuthMiddleware.validateJWT], controller.updateSchedule);
    router.delete('/:id', [AuthMiddleware.validateJWT], controller.deleteSchedule)
    return router;
  }
}