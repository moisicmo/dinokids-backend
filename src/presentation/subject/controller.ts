import { Response, Request } from 'express';
import { CustomError, PaginationDto, SubjectDto } from '../../domain';
import { SubjectService } from '../services';

export class SubjectController {

  constructor(
    private readonly subjectService: SubjectService,
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getSubjects = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.subjectService.getSubjects(paginationDto!)
      .then(subjects => res.json(subjects))
      .catch(error => this.handleError(error, res));
  };

  createSubject = (req: Request, res: Response) => {

    const [error, subjectDto] = SubjectDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.subjectService.createSubject(subjectDto!, req.body.user)
      .then(subject => res.status(201).json(subject))
      .catch(error => this.handleError(error, res));

  };

  updateSubject = (req: Request, res: Response) => {

    const [error, subjectDto] = SubjectDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.subjectService.updateSubject(subjectDto!, req.body.user, parseInt(req.params.id))
      .then(subject => res.status(201).json(subject))
      .catch(error => this.handleError(error, res));

  };

  deleteSubject = (req: Request, res: Response) => {

    this.subjectService.deleteSubject(req.body.user, parseInt(req.params.id))
      .then(subject => res.status(201).json(subject))
      .catch(error => this.handleError(error, res));

  };
}