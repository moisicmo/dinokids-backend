import { PrismaClient } from '@prisma/client';
import {
  CustomError,
  CustomSuccessful,
  PaginationDto,
  RequirementDto,
  RequirementEntity,
  UserEntity,
} from '../../domain';

const prisma = new PrismaClient();

export class RequirementService {
  constructor() {}

  async getRequirements(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, requirements] = await Promise.all([
        prisma.requirements.count({ where: { state: true } }),
        prisma.requirements.findMany({
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
          next: `/api/requirement?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/requirement?page=${page - 1}&limit=${limit}`
              : null,
          requirements: requirements.map((requirement) => {
            const { ...requirementEntity } = RequirementEntity.fromObject(requirement);
            return requirementEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createRequirement(
    createRequirementDto: RequirementDto,
    user: UserEntity
  ) {
    const requirementExists = await prisma.requirements.findFirst({
      where: { name: createRequirementDto.name, state: true },
    });
    if (requirementExists)
      throw CustomError.badRequest('El requisito ya existe');

    try {
      const requirement = await prisma.requirements.create({
        data: {
          ...createRequirementDto,
        },
      });

      const { ...requirementEntity } =
        RequirementEntity.fromObject(requirement);
      return CustomSuccessful.response({ result: requirementEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateRequirement(
    updateRequirement: RequirementDto,
    user: UserEntity,
    requirementId: number
  ) {
    const existingRequirementWithName = await prisma.requirements.findFirst({
      where: {
        AND: [{ name: updateRequirement.name }, { NOT: { id: requirementId } }],
      },
    });
    if (existingRequirementWithName)
      throw CustomError.badRequest(
        'Ya existe un requisito con el mismo nombre'
      );

    const requirementExists = await prisma.requirements.findFirst({
      where: { id: requirementId },
    });
    if (!requirementExists)
      throw CustomError.badRequest('El requisito no existe');

    try {
      const requirement = await prisma.requirements.update({
        where: { id: requirementId },
        data: {
          ...updateRequirement,
        },
      });
      const { ...requirementEntity } =
        RequirementEntity.fromObject(requirement);
      return CustomSuccessful.response({ result: requirementEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteRequirement(user: UserEntity, requirementId: number) {
    const requirementExists = await prisma.requirements.findFirst({
      where: { id: requirementId },
    });
    if (!requirementExists)
      throw CustomError.badRequest('El requisito no existe');
    try {
      await prisma.requirements.update({
        where: { id: requirementId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Requisito eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
