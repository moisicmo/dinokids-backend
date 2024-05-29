import { PrismaClient } from '@prisma/client';
import {
  CustomError,
  PaginationDto,
  UserEntity,
  TypeProjectEntity,
  TypeProjectDto,
  CustomSuccessful,
} from '../../domain';

const prisma = new PrismaClient();

export class TypeProjectService {
  constructor() {}

  async getTypeProjects(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, typeProjects] = await Promise.all([
        prisma.typeProjects.count({ where: { state: true } }),
        prisma.typeProjects.findMany({
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
          next: `/api/typeProject?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/typeProject?page=${page - 1}&limit=${limit}`
              : null,
          typeProjects: typeProjects.map((typeProject) => {
            const { ...typeProjectEntity } =
              TypeProjectEntity.fromObject(typeProject);
            return typeProjectEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createTypeProject(
    createTypeProjectDto: TypeProjectDto,
    user: UserEntity
  ) {
    const typeProjectExists = await prisma.typeProjects.findFirst({
      where: { name: createTypeProjectDto.name, state: true },
    });
    if (typeProjectExists)
      throw CustomError.badRequest('El tipo de proyecto ya existe');

    try {
      const typeProject = await prisma.typeProjects.create({
        data: {
          ...createTypeProjectDto,
        },
      });

      const { ...typeProjectEntity } =
        TypeProjectEntity.fromObject(typeProject);
      return CustomSuccessful.response({ result: typeProjectEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateTypeProject(
    updateTypeProjectDto: TypeProjectDto,
    user: UserEntity,
    typeProjectId: number
  ) {
    const existingtypeProjectWithName = await prisma.typeProjects.findFirst({
      where: {
        AND: [
          { name: updateTypeProjectDto.name },
          { NOT: { id: typeProjectId } },
        ],
      },
    });
    if (existingtypeProjectWithName)
      throw CustomError.badRequest(
        'Ya existe un tipo de proyecto con el mismo nombre'
      );

    const typeProjectExists = await prisma.typeProjects.findFirst({
      where: { id: typeProjectId },
    });
    if (!typeProjectExists)
      throw CustomError.badRequest('El tipo de proyecto no existe');

    try {
      const typeProject = await prisma.typeProjects.update({
        where: { id: typeProjectId },
        data: {
          ...updateTypeProjectDto,
        },
      });
      const { ...typeProjectEntity } =
        TypeProjectEntity.fromObject(typeProject);
      return CustomSuccessful.response({ result: typeProjectEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteTypeProject(user: UserEntity, typeProjectId: number) {
    const typeProjectExists = await prisma.typeProjects.findFirst({
      where: { id: typeProjectId },
    });
    if (!typeProjectExists)
      throw CustomError.badRequest('El tipo de proyecto no existe');
    try {
      await prisma.typeProjects.update({
        where: { id: typeProjectId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({
        message: 'Tipo de proyecto eliminado',
      });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
