import { PrismaClient } from '@prisma/client';
import {
  BranchDto,
  BranchEntity,
  CustomError,
  CustomSuccessful,
  PaginationDto,
  UserEntity,
} from '../../domain';

const prisma = new PrismaClient();

export class BranchService {
  constructor() {}

  async getBranches(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, branches] = await Promise.all([
        prisma.branches.count({ where: { state: true } }),
        prisma.branches.findMany({
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
          next: `/api/branch?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/branch?page=${page - 1}&limit=${limit}`
              : null,
              branches: branches.map((branch) => {
            const { ...branchEntity } = BranchEntity.fromObject(branch);
            return branchEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createBranch(createBranchDto: BranchDto, user: UserEntity) {
    const branchExists = await prisma.branches.findFirst({
      where: { name: createBranchDto.name, state: true },
    });
    if (branchExists) throw CustomError.badRequest('La sucursal ya existe');

    try {
      const branch = await prisma.branches.create({
        data: {
          ...createBranchDto,
        },
      });

      const { ...branchEntity } = BranchEntity.fromObject(branch);
      return CustomSuccessful.response({ result: branchEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateBranch(
    updateBranch: BranchDto,
    user: UserEntity,
    branchId: number
  ) {
    const existingBranchWithName = await prisma.branches.findFirst({
      where: {
        AND: [{ name: updateBranch.name }, { NOT: { id: branchId } }],
      },
    });
    if (existingBranchWithName)
      throw CustomError.badRequest(
        'Ya existe una sucursal con el mismo nombre'
      );

    const branchExists = await prisma.branches.findFirst({
      where: { id: branchId },
    });
    if (!branchExists) throw CustomError.badRequest('La sucursal no existe');

    try {
      const branch = await prisma.branches.update({
        where: { id: branchId },
        data: {
          ...updateBranch,
        },
      });
      const { ...branchEntity } = BranchEntity.fromObject(branch);
      return CustomSuccessful.response({ result: branchEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteBranch(user: UserEntity, branchId: number) {
    const branchExists = await prisma.branches.findFirst({
      where: { id: branchId },
    });
    if (!branchExists) throw CustomError.badRequest('La sucursal no existe');
    try {
      await prisma.branches.update({
        where: { id: branchId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Sucursal eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
