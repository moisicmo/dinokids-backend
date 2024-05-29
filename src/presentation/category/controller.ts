import { Response, Request } from 'express';
import { CategoryDto, CustomError, PaginationDto } from '../../domain';
import { CategoryService } from '../services';

export class CategoryController {

  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getCategories = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.categoryService.getCategories(paginationDto!)
      .then(caretories => res.json(caretories))
      .catch(error => this.handleError(error, res));
  };

  createCategory = (req: Request, res: Response) => {

    const [error, categoryDto] = CategoryDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.categoryService.createCategory(categoryDto!, req.body.user)
      .then(caretory => res.status(201).json(caretory))
      .catch(error => this.handleError(error, res));

  };

  updateCategory = (req: Request, res: Response) => {

    const [error, categoryDto] = CategoryDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.categoryService.updateCategory(categoryDto!, req.body.user, parseInt(req.params.id))
      .then(caretory => res.status(201).json(caretory))
      .catch(error => this.handleError(error, res));

  };

  deleteCategory = (req: Request, res: Response) => {

    this.categoryService.deleteCategory(req.body.user, parseInt(req.params.id))
      .then(caretory => res.status(201).json(caretory))
      .catch(error => this.handleError(error, res));

  };
}