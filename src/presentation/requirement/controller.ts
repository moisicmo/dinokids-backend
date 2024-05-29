import { Response, Request } from 'express';
import { RequirementDto, CustomError, PaginationDto } from '../../domain';
import { RequirementService } from '../services';

export class RequirementController {

  constructor(
    private readonly requirementService: RequirementService,
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getRequirements = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.requirementService.getRequirements(paginationDto!)
      .then(requirements => res.json(requirements))
      .catch(error => this.handleError(error, res));
  };

  createRequirement = (req: Request, res: Response) => {

    const [error, requirementDto] = RequirementDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.requirementService.createRequirement(requirementDto!, req.body.user)
      .then(requirement => res.status(201).json(requirement))
      .catch(error => this.handleError(error, res));

  };

  updateRequirement = (req: Request, res: Response) => {

    const [error, requirementDto] = RequirementDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.requirementService.updateRequirement(requirementDto!, req.body.user, parseInt(req.params.id))
      .then(requirement => res.status(201).json(requirement))
      .catch(error => this.handleError(error, res));

  };

  deleteRequirement = (req: Request, res: Response) => {

    this.requirementService.deleteRequirement(req.body.user, parseInt(req.params.id))
      .then(caretory => res.status(201).json(caretory))
      .catch(error => this.handleError(error, res));

  };
}