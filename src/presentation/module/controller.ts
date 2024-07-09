import { Response, Request } from 'express';
import { CustomError, PaginationDto, ModuleDto } from '../../domain';
import { ModuleService } from '../services';

export class ModuleController {

  constructor(
    private readonly moduleService: ModuleService,
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getModules = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.moduleService.getModules(paginationDto!)
      .then(modules => res.json(modules))
      .catch(error => this.handleError(error, res));
  };

  createModule = (req: Request, res: Response) => {

    const [error, moduleDto] = ModuleDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.moduleService.createModule(moduleDto!, req.body.user)
      .then(module => res.status(201).json(module))
      .catch(error => this.handleError(error, res));

  };

  updateModule = (req: Request, res: Response) => {

    const [error, moduleDto] = ModuleDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.moduleService.updateModule(moduleDto!, req.body.user, parseInt(req.params.id))
      .then(module => res.status(201).json(module))
      .catch(error => this.handleError(error, res));

  };

  deleteModule = (req: Request, res: Response) => {

    this.moduleService.deleteModule(req.body.user, parseInt(req.params.id))
      .then(module => res.status(201).json(module))
      .catch(error => this.handleError(error, res));

  };
}