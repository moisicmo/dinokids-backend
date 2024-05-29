import { Response, Request } from 'express';
import { CustomError, PaginationDto, TypeProjectDto } from '../../domain';
import { CategoryService, TypeProjectService } from '../services';

export class TypeProjectController {

  constructor(
    private readonly typeProjectService: TypeProjectService,
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getTypeProjects = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.typeProjectService.getTypeProjects(paginationDto!)
      .then(typeProjects => res.json(typeProjects))
      .catch(error => this.handleError(error, res));
  };

  createTypeProject = (req: Request, res: Response) => {

    const [error, typeProjectDto] = TypeProjectDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.typeProjectService.createTypeProject(typeProjectDto!, req.body.user)
      .then(typeProject => res.status(201).json(typeProject))
      .catch(error => this.handleError(error, res));

  };

  updateTypeProject = (req: Request, res: Response) => {

    const [error, typeProjectDto] = TypeProjectDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.typeProjectService.updateTypeProject(typeProjectDto!, req.body.user, parseInt(req.params.id))
      .then(typeProject => res.status(201).json(typeProject))
      .catch(error => this.handleError(error, res));

  };

  deleteTypeProject = (req: Request, res: Response) => {

    this.typeProjectService.deleteTypeProject(req.body.user, parseInt(req.params.id))
      .then(typeProject => res.status(201).json(typeProject))
      .catch(error => this.handleError(error, res));

  };
}