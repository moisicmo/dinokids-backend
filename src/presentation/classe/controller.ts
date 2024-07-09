import { Response, Request } from 'express';
import { CustomError, PaginationDto, ModuleDto, ClasseDto } from '../../domain';
import { ClasseService } from '../services';

export class ClasseController {

  constructor(
    private readonly classesService: ClasseService,
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getClasses = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.classesService.getClasses(paginationDto!)
      .then(classes => res.json(classes))
      .catch(error => this.handleError(error, res));
  };

  createClasses = (req: Request, res: Response) => {

    const [error, classesDto] = ClasseDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.classesService.createClasses(classesDto!, req.body.user)
      .then(classes => res.status(201).json(classes))
      .catch(error => this.handleError(error, res));

  };

  updateClasses = (req: Request, res: Response) => {

    const [error, classesDto] = ClasseDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.classesService.updateClasses(classesDto!, req.body.user, parseInt(req.params.id))
      .then(classes => res.status(201).json(classes))
      .catch(error => this.handleError(error, res));

  };

  deleteClasses = (req: Request, res: Response) => {

    this.classesService.deleteClasses(req.body.user, parseInt(req.params.id))
      .then(module => res.status(201).json(module))
      .catch(error => this.handleError(error, res));

  };
}