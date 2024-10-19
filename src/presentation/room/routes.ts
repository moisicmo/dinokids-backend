import { Router } from 'express';
import { RoomController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoomService } from '../services';

export class RoomRoutes {
  static get routes(): Router {

    const router = Router();
    const roomService = new RoomService();
    const controller = new RoomController(roomService);

    // rutas
    router.get('/', [AuthMiddleware.validateJWT], controller.getRooms);
    router.post('/', [AuthMiddleware.validateJWT], controller.createRoom);
    router.put('/:id', [AuthMiddleware.validateJWT], controller.updateRoom);
    router.delete('/:id', [AuthMiddleware.validateJWT], controller.deleteRoom)
    return router;
  }
}

