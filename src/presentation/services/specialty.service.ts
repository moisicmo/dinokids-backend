import { PrismaClient } from '@prisma/client';
import {
  CustomError,
  PaginationDto,
  UserEntity,
  CustomSuccessful,
  SpecialtyDto,
  SpecialtyEntity,
} from '../../domain';

const prisma = new PrismaClient();

export class SpecialtyService {
  constructor() { }

  async getSpecialtiesbyBranch(paginationDto: PaginationDto, branchId: number) {
    const { page, limit } = paginationDto;
    try {
      const [total, specialties] = await Promise.all([
        prisma.specialties.count({
          where: {
            state: true,
            rooms: {
              some: {
                branchId: branchId
              }
            }
          }
        }),
        prisma.specialties.findMany({
          where: {
            state: true,
            // rooms: {
            //   some: {
            //     branchId: branchId
            //   }
            // }
          },
          include: {
            rooms: {
              where: {
                branchId: branchId
              },
              include:{
                branch:true,
                specialty: true,
                teacher: {
                  include:{
                    user:true,
                  }
                },
              },
            }
          },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);
      console.log(specialties)
      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/specialty?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/specialty?page=${page - 1}&limit=${limit}`
              : null,
          specialties: specialties.map((specialty) => {
            console.log(specialty)
            const { ...moduleEntity } = SpecialtyEntity.fromObject(specialty);
            return moduleEntity;
          }),
        },
      });
    } catch (error) {
      console.log(error)
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createSpecialty(createModuleDto: SpecialtyDto, user: UserEntity) {
    try {
      const specialty = await prisma.specialties.create({
        data: {
          ...createModuleDto,
        },
      });

      const { ...moduleEntity } = SpecialtyEntity.fromObject(specialty);
      return CustomSuccessful.response({ result: moduleEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateSpecialty(
    updateModuleDto: SpecialtyDto,
    user: UserEntity,
    specialtyId: number
  ) {
    const ModuleExists = await prisma.specialties.findFirst({
      where: { id: specialtyId },
    });
    if (!ModuleExists) throw CustomError.badRequest('El módulo no existe');

    try {
      const module = await prisma.specialties.update({
        where: { id: specialtyId },
        data: {
          ...updateModuleDto,
        },
      });
      const { ...moduleEntity } = SpecialtyEntity.fromObject(module);
      return CustomSuccessful.response({ result: moduleEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteSpecialty(user: UserEntity, specialtyId: number) {
    const moduleExists = await prisma.specialties.findFirst({
      where: { id: specialtyId },
    });
    if (!moduleExists) throw CustomError.badRequest('El módulo no existe');
    try {
      await prisma.specialties.update({
        where: { id: specialtyId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Módulo eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
