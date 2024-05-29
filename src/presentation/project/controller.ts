import { Response, Request } from 'express';
import { CustomError, PaginationDto, ProjectDto } from '../../domain';
import { ProjectService } from '../services';

export class ProjectController {

  constructor(
    private readonly projectService: ProjectService,
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getProjects = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.projectService.getProjects(paginationDto!)
      .then(projects => res.json(projects))
      .catch(error => this.handleError(error, res));
  };

  getDocumentXlsx = async (req: Request, res: Response) => {
    try {
        const document = await this.projectService.getDocumentXlsx(req.body.user, parseInt(req.params.id));

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
res.setHeader('Content-Disposition', 'attachment; filename=project.xlsx');
res.send(document); // Donde `document` es tu `Uint8Array` que contiene el archivo Excel
    } catch (error) {
        this.handleError(error, res);
    }
};

  createProject = (req: Request, res: Response) => {

    const [error, createParallelDto] = ProjectDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.projectService.createProject(createParallelDto!, req.body.user)
      .then(project => {
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json(project)
      })
      .catch(error => this.handleError(error, res));

  };

  updateProject = (req: Request, res: Response) => {

    const [error, updateParallelDto] = ProjectDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.projectService.updateProject(updateParallelDto!, req.body.user, parseInt(req.params.id))
      .then(project => res.status(201).json(project))
      .catch(error => this.handleError(error, res));

  };

  deleteProject = (req: Request, res: Response) => {

    this.projectService.deleteProject(req.body.user, parseInt(req.params.id))
      .then(project => res.status(201).json(project))
      .catch(error => this.handleError(error, res));

  };
}