import { Response, Request } from 'express';
import { CustomError, PaginationDto, ScheduleDto } from '../../domain';
import { ScheduleService } from '../services';

export class ScheduleController {

  constructor(
    private readonly scheduleService: ScheduleService,
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getSchedules = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.scheduleService.getSchedules(paginationDto!,parseInt(req.params.id))
      .then(schedules => res.json(schedules))
      .catch(error => this.handleError(error, res));
  };

  createSchedule = (req: Request, res: Response) => {

    const [error, scheduleDto] = ScheduleDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.scheduleService.createSchedule(scheduleDto!, req.body.user)
      .then(schedule => res.status(201).json(schedule))
      .catch(error => this.handleError(error, res));

  };

  updateSchedule = (req: Request, res: Response) => {

    const [error, scheduleDto] = ScheduleDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.scheduleService.updateSchedule(scheduleDto!, req.body.user, parseInt(req.params.id))
      .then(schedule => res.status(201).json(schedule))
      .catch(error => this.handleError(error, res));

  };

  deleteSchedule = (req: Request, res: Response) => {

    this.scheduleService.deleteSchedule(req.body.user, parseInt(req.params.id))
      .then(schedule => res.status(201).json(schedule))
      .catch(error => this.handleError(error, res));

  };
}