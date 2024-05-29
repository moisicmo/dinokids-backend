import { Response, Request } from 'express';
import { CustomError, PaginationDto, ParallelDto, ParallelFileDto } from '../../domain';
import { ParallelService } from '../services';
import { UploadedFile } from 'express-fileupload';

export class ParallelController {

  constructor(
    private readonly parallelService: ParallelService,
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getParallels = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.parallelService.getParallels(paginationDto!)
      .then(parallels => res.json(parallels))
      .catch(error => this.handleError(error, res));
  };

  createParallel = (req: Request, res: Response) => {

    const [error, createParallelDto] = ParallelDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.parallelService.createParallel(createParallelDto!, req.body.user)
      .then(parallel => res.status(201).json(parallel))
      .catch(error => this.handleError(error, res));

  };

  updateParallel = (req: Request, res: Response) => {

    const [error, updateParallelDto] = ParallelDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.parallelService.updateParallel(updateParallelDto!, req.body.user, parseInt(req.params.id))
      .then(parallel => res.status(201).json(parallel))
      .catch(error => this.handleError(error, res));

  };

  deleteParallel = (req: Request, res: Response) => {

    this.parallelService.deleteParallel(req.body.user, parseInt(req.params.id))
      .then(parallel => res.status(201).json(parallel))
      .catch(error => this.handleError(error, res));

  };

  createParallels = (req: Request, res: Response) => {
    const file = req.files?.file;
    const [error, createParallelFileDto] = ParallelFileDto.body({ file });
    if (error) return res.status(400).json({ error });

    this.parallelService.createParallels(createParallelFileDto!, req.body.user)
      .then(parallel => res.status(201).json(parallel))
      .catch(error => this.handleError(error, res));

  };
}