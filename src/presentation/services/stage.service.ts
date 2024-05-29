import { PrismaClient } from '@prisma/client';
import {
  CustomError,
  PaginationDto,
  UserEntity,
  StageEntity,
  StageDto,
  CustomSuccessful,
} from '../../domain';

const prisma = new PrismaClient();

export class StageService {
  constructor() {}

  async getStages(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, stages] = await Promise.all([
        prisma.stages.count({ where: { state: true } }),
        prisma.stages.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: {
            state: true,
          },
          include: {
            requirements: true,
          },
        }),
      ]);
      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/stage?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0 ? `/api/stage?page=${page - 1}&limit=${limit}` : null,
          stages: stages.map((stage) => {
            const { ...stageEntity } = StageEntity.fromObject(stage);
            return stageEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createStage(stageDto: StageDto, user: UserEntity) {
    const { requirements, ...createStageDto } = stageDto;
    const stageExists = await prisma.stages.findFirst({
      where: { name: createStageDto.name },
    });
    if (stageExists) throw CustomError.badRequest('la etapa ya existe');

    try {
      const stage = await prisma.stages.create({
        data: {
          ...createStageDto,
          requirements: {
            connect: requirements.map((requirementId) => ({
              id: requirementId,
            })),
          },
        },
        include: {
          requirements: true,
        },
      });

      const { ...stageEntity } = StageEntity.fromObject(stage);
      return CustomSuccessful.response({ result: stageEntity});
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateStage(stageDto: StageDto, user: UserEntity, stageId: number) {
    const { requirements, ...updateStageDto } = stageDto;
    const existingStageWithName = await prisma.stages.findFirst({
      where: {
        AND: [{ name: updateStageDto.name }, { NOT: { id: stageId } }],
      },
    });
    if (existingStageWithName)
      throw CustomError.badRequest('Ya existe una etapa con el mismo nombre');
    const stageExists = await prisma.stages.findFirst({
      where: { id: stageId },
      include: {
        requirements: true,
      },
    });
    if (!stageExists) throw CustomError.badRequest('La etapa no existe');

    try {
      const stage = await prisma.stages.update({
        where: { id: stageId },
        data: {
          ...updateStageDto,
          requirements: {
            disconnect: stageExists.requirements.map((requirement) => ({
              id: requirement.id,
            })),
            connect: requirements.map((requirementId) => ({
              id: requirementId,
            })),
          },
        },
        include: {
          requirements: true,
        },
      });
      const { ...stageEntity } = StageEntity.fromObject(stage);
      return CustomSuccessful.response({ result: stageEntity});
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteStage(user: UserEntity, stageId: number) {
    const stageExists = await prisma.stages.findFirst({
      where: { id: stageId },
      include: {
        requirements: true,
      },
    });
    if (!stageExists) throw CustomError.badRequest('La etapa no existe');
    try {
      await prisma.stages.update({
        where: { id: stageId },
        data: {
          state: false,
          requirements: {
            disconnect: stageExists.requirements.map((requirement) => ({
              id: requirement.id,
            })),
          },
        },
        include: {
          requirements: true,
        },
      });
      return CustomSuccessful.response({ message: 'Etapa eliminado'});
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
