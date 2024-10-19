import { Response, Request } from 'express';
import { CustomError, PaginationDto, RoomDto } from '../../domain';
import { RoomService } from '../services';

export class RoomController {

  constructor(
    private readonly roomService: RoomService,
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getRooms = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.roomService.getRooms(paginationDto!)
      .then(caretories => res.json(caretories))
      .catch(error => this.handleError(error, res));
  };

  createRoom = (req: Request, res: Response) => {

    const [error, roomDto] = RoomDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.roomService.createRoom(roomDto!, req.body.user)
      .then(room => res.status(201).json(room))
      .catch(error => this.handleError(error, res));

  };

  updateRoom = (req: Request, res: Response) => {

    const [error, roomDto] = RoomDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.roomService.updateRoom(roomDto!, req.body.user, parseInt(req.params.id))
      .then(room => res.status(201).json(room))
      .catch(error => this.handleError(error, res));

  };

  deleteRoom = (req: Request, res: Response) => {

    this.roomService.deleteRoom(req.body.user, parseInt(req.params.id))
      .then(room => res.status(201).json(room))
      .catch(error => this.handleError(error, res));

  };
}