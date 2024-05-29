import { PrismaClient } from '@prisma/client';
import {
  CategoryDto,
  CategoryEntity,
  CustomError,
  CustomSuccessful,
  PaginationDto,
  UserEntity,
} from '../../domain';

const prisma = new PrismaClient();

export class CategoryService {
  constructor() {}

  async getCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, categories] = await Promise.all([
        prisma.categories.count({ where: { state: true } }),
        prisma.categories.findMany({
          where: {
            state: true,
          },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/category?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/category?page=${page - 1}&limit=${limit}`
              : null,
          categories: categories.map((category) => {
            const { ...categoryEntity } = CategoryEntity.fromObject(category);
            return categoryEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createCategory(createCategoryDto: CategoryDto, user: UserEntity) {
    const categoryExists = await prisma.categories.findFirst({
      where: { name: createCategoryDto.name, state: true },
    });
    if (categoryExists) throw CustomError.badRequest('La categoria ya existe');

    try {
      const category = await prisma.categories.create({
        data: {
          ...createCategoryDto,
        },
      });

      const { ...categoryEntity } = CategoryEntity.fromObject(category);
      return CustomSuccessful.response({ result: categoryEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateCategory(
    updateCategory: CategoryDto,
    user: UserEntity,
    categoryId: number
  ) {
    const existingCategoryWithName = await prisma.categories.findFirst({
      where: {
        AND: [{ name: updateCategory.name }, { NOT: { id: categoryId } }],
      },
    });
    if (existingCategoryWithName)
      throw CustomError.badRequest(
        'Ya existe una categoria con el mismo nombre'
      );

    const categoryExists = await prisma.categories.findFirst({
      where: { id: categoryId },
    });
    if (!categoryExists) throw CustomError.badRequest('La categoria no existe');

    try {
      const category = await prisma.categories.update({
        where: { id: categoryId },
        data: {
          ...updateCategory,
        },
      });
      const { ...categoryEntity } = CategoryEntity.fromObject(category);
      return CustomSuccessful.response({ result: categoryEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteCategory(user: UserEntity, categoryId: number) {
    const categoryExists = await prisma.categories.findFirst({
      where: { id: categoryId },
    });
    if (!categoryExists) throw CustomError.badRequest('La categoria no existe');
    try {
      await prisma.categories.update({
        where: { id: categoryId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Categoria eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
