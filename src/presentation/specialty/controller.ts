import { Response, Request } from 'express';
import { CustomError, PaginationDto, SpecialtyDto } from '../../domain';
import { SpecialtyService } from '../services';

export class SpecialtyController {

  constructor(
    private readonly moduleService: SpecialtyService,
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getSpecialtiesbyBranch = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.moduleService.getSpecialtiesbyBranch(paginationDto!,parseInt(req.params.branchId))
      .then(data => res.json(data))
      .catch(error => this.handleError(error, res));
  };

  createSpecialty = (req: Request, res: Response) => {

    const [error, moduleDto] = SpecialtyDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.moduleService.createSpecialty(moduleDto!, req.body.user)
      .then(data => res.status(201).json(data))
      .catch(error => this.handleError(error, res));

  };

  updateSpecialty = (req: Request, res: Response) => {

    const [error, moduleDto] = SpecialtyDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.moduleService.updateSpecialty(moduleDto!, req.body.user, parseInt(req.params.id))
      .then(data => res.status(201).json(data))
      .catch(error => this.handleError(error, res));

  };

  deleteSpecialty = (req: Request, res: Response) => {

    this.moduleService.deleteSpecialty(req.body.user, parseInt(req.params.id))
      .then(data => res.status(201).json(data))
      .catch(error => this.handleError(error, res));

  };
}