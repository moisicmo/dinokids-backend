import { Response, Request } from 'express';
import { CustomError, PaginationDto, SeasonDto } from '../../domain';
import { SeasonService } from '../services';

export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getSeasonEnable = async (req: Request, res: Response) => {
    this.seasonService
      .getSeasonEnable()
      .then((seasons) => res.json(seasons))
      .catch((error) => this.handleError(error, res));
  };

  getSeasons = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.seasonService
      .getSeasons(paginationDto!)
      .then((seasons) => res.json(seasons))
      .catch((error) => this.handleError(error, res));
  };

  createSeason = (req: Request, res: Response) => {
    const [error, createSeasonDto] = SeasonDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.seasonService
      .createSeason(createSeasonDto!, req.body.user)
      .then((season) => res.status(201).json(season))
      .catch((error) => this.handleError(error, res));
  };

  updateSeason = (req: Request, res: Response) => {
    const [error, updateSeasonDto] = SeasonDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.seasonService
      .updateSeason(updateSeasonDto!, req.body.user, parseInt(req.params.id))
      .then((season) => res.status(201).json(season))
      .catch((error) => this.handleError(error, res));
  };

  deleteSeason = (req: Request, res: Response) => {
    this.seasonService
      .deleteSeason(req.body.user, parseInt(req.params.id))
      .then((season) => res.status(201).json(season))
      .catch((error) => this.handleError(error, res));
  };

  enableSeason = (req: Request, res: Response) => {
    this.seasonService
      .enableSeason(req.body.user, parseInt(req.params.id))
      .then((season) => res.status(201).json(season))
      .catch((error) => this.handleError(error, res));
  };
}
