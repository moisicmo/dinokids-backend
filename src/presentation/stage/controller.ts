import { Response, Request } from 'express';
import { CustomError, PaginationDto, StageDto } from '../../domain';
import { StageService } from '../services';

export class StageController {

  constructor(
    private readonly stageService: StageService,
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getStages = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.stageService.getStages(paginationDto!)
      .then(stages => res.json(stages))
      .catch(error => this.handleError(error, res));
  };

  createStage = (req: Request, res: Response) => {

    const [error, createStageDto] = StageDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.stageService.createStage(createStageDto!, req.body.user)
      .then(stage => res.status(201).json(stage))
      .catch(error => this.handleError(error, res));

  };

  updateStage = (req: Request, res: Response) => {

    const [error, updateStageDto] = StageDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.stageService.updateStage(updateStageDto!, req.body.user, parseInt(req.params.id))
      .then(stage => res.status(201).json(stage))
      .catch(error => this.handleError(error, res));

  };

  deleteStage = (req: Request, res: Response) => {

    this.stageService.deleteStage(req.body.user, parseInt(req.params.id))
      .then(stage => res.status(201).json(stage))
      .catch(error => this.handleError(error, res));

  };
}