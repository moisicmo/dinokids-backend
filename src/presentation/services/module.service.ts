import { PrismaClient } from '@prisma/client';
import {
  CustomError,
  PaginationDto,
  UserEntity,
  CustomSuccessful,
  ModuleDto,
  ModuleEntity,
} from '../../domain';

const prisma = new PrismaClient();

export class ModuleService {
  constructor() { }

  async getModules(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, modules] = await Promise.all([
        prisma.modules.count({ where: { state: true } }),
        prisma.modules.findMany({
          where: {
            state: true,
          },
          include: {
            subject: true,
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
          next: `/api/module?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/module?page=${page - 1}&limit=${limit}`
              : null,
          modules: modules.map((module) => {
            const { ...moduleEntity } = ModuleEntity.fromObject(module);
            return moduleEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createModule(createModuleDto: ModuleDto, user: UserEntity) {
    try {
      const module = await prisma.modules.create({
        data: {
          ...createModuleDto,
        },
        include: {
          subject: true,
        },
      });

      const { ...moduleEntity } = ModuleEntity.fromObject(module);
      return CustomSuccessful.response({ result: moduleEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateModule(
    updateModuleDto: ModuleDto,
    user: UserEntity,
    moduleId: number
  ) {
    const ModuleExists = await prisma.modules.findFirst({
      where: { id: moduleId },
    });
    if (!ModuleExists) throw CustomError.badRequest('El módulo no existe');

    try {
      const module = await prisma.modules.update({
        where: { id: moduleId },
        data: {
          ...updateModuleDto,
        },
        include: {
          subject: true,
        },
      });
      const { ...moduleEntity } = ModuleEntity.fromObject(module);
      return CustomSuccessful.response({ result: moduleEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteModule(user: UserEntity, moduleId: number) {
    const moduleExists = await prisma.modules.findFirst({
      where: { id: moduleId },
    });
    if (!moduleExists) throw CustomError.badRequest('El módulo no existe');
    try {
      await prisma.modules.update({
        where: { id: moduleId },
        data: {
          state: false,
        },
        include: {
          subject: true,
        },
      });
      return CustomSuccessful.response({ message: 'Módulo eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
