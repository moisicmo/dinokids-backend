import { PrismaClient } from '@prisma/client';
import {
  CustomError,
  PaginationDto,
  UserEntity,
  InscriptionDto,
  InscriptionEntity,
  CustomSuccessful,
} from '../../domain';
import { generatePdf } from '../../config';
import { includes } from 'valibot';

const prisma = new PrismaClient();

export class InscriptionService {
  constructor() { }

  async getInscriptions(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, inscriptions] = await Promise.all([
        prisma.inscriptions.count({ where: { state: true } }),
        prisma.inscriptions.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: {
            state: true,
          },
          include: {
            student: {
              include: {
                user: true,
              },
            },
            staff: {
              include: {
                user: true,
              },
            },
            price: true,
            monthlyFee: {
              include: {
                invoices: true,
              },
            },
            rooms: {
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
        }),
      ]);
      //console.log("inscriptions many:",inscriptions)

      const resData = CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/inscription?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/inscription?page=${page - 1}&limit=${limit}`
              : null,
          inscriptions: inscriptions.map((inscription) => {
            const { ...inscriptionEntity } =
              InscriptionEntity.fromObject(inscription);
            return inscriptionEntity;
          }),
        },
      });
      return resData;
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createInscription(dto: InscriptionDto, user: UserEntity) {
    try {
      const {  inscription, month,...dtoInscription } = dto;
      const inscriptionExists = await prisma.inscriptions.findFirst({
        where: {
          studentId: dtoInscription.studentId,
          rooms: {
            some: {
              id: {
                in: dtoInscription.rooms
              }
            }
          }
        },
      });
      if (inscriptionExists) throw CustomError.badRequest('La inscripción ya existe');
      const newPrice = await prisma.price.create({
        data: {
          inscription: inscription,
          month: month,
        },
      });
      const newInscription = await prisma.inscriptions.create({
        data: {
          ...dtoInscription,
          staffId: user.id,
          priceId: newPrice.id,
          rooms: {
            connect: dto.rooms.map((roomId) => ({ id: roomId })),
          },
          total: 100,
        },
        include: {
          student: {
            include: {
              user: true,
              tutors: {
                include:{
                  user:true,
                }
              },
            },
          },
          staff: {
            include: {
              user: true,
            },
          },
          price: true,
          rooms: {
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
      });
      const { ...inscriptionEntity } = await InscriptionEntity.fromObject(
        newInscription
      );
      const document = await generatePdf(inscriptionEntity);
      const resData = CustomSuccessful.response({
        result: {
          ...inscriptionEntity,
          document
        }
      })
      console.log("create inscription resData:", resData);
      return resData;
    } catch (error) {
      console.log(error)
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateInscription(
    dto: InscriptionDto,
    user: UserEntity,
    inscriptionId: number
  ) {
    try {
      const { ...updateInscriptionDto } = dto;
      const existingInscriptionWithName = await prisma.inscriptions.findFirst({
        where: {
          AND: [
            {
              studentId: updateInscriptionDto.studentId,
            },
            { NOT: { id: inscriptionId } },
          ],
        },
      });
      if (existingInscriptionWithName)
        throw CustomError.badRequest(
          'Ya existe una inscripción con el estudiante y en la misma materia'
        );
      const inscriptionExists = await prisma.inscriptions.findFirst({
        where: { id: inscriptionId },
        include: {
          student: true,
          staff: true,
          rooms: true,
        },
      });
      if (!inscriptionExists)
        throw CustomError.badRequest('La inscripción no existe');

      const inscription = await prisma.inscriptions.update({
        where: { id: inscriptionId },
        data: {
          ...updateInscriptionDto,
          rooms: {
            disconnect: inscriptionExists.rooms.map((permission) => ({
              id: permission.id,
            })),
            connect: dto.rooms.map((roomId) => ({ id: roomId })),
          },
          total: 100,
        },
        include: {
          student: {
            include: {
              user: true,
            },
          },
          staff: {
            include: {
              user: true,
            },
          },
          rooms: {
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
      });
      const { ...inscriptionEntity } = InscriptionEntity.fromObject(
        inscription!
      );
      return CustomSuccessful.response({ result: inscriptionEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteInscription(user: UserEntity, inscriptionId: number) {
    const inscriptionExists = await prisma.inscriptions.findFirst({
      where: { id: inscriptionId },
      include: {
        student: true,
        staff: true,
      },
    });
    if (!inscriptionExists)
      throw CustomError.badRequest('La inscripción no existe');
    try {
      await prisma.inscriptions.update({
        where: { id: inscriptionId },
        data: {
          state: false,
        },
      });

      return CustomSuccessful.response({ message: 'Inscripción eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  /// get Inscription By Id
  async getInscriptionsById(inscriptionId: number) {
    try {
      const inscription = await prisma.inscriptions.findFirst({
        where: { id: inscriptionId },
        include: {
          student: {
            include: {
              user: true,
            },
          },
          staff: {
            include: {
              user: true,
            },
          },
          price: true,
        },
      });
      const { ...inscriptionEntity } = InscriptionEntity.fromObject(
        inscription!
      );
      return CustomSuccessful.response({ result: inscriptionEntity });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }
  // get inscriptions By Id Students
  async getInscriptionsByIdStundent(
    paginationDto: PaginationDto,
    idStundet: number
  ) {
    const { page, limit } = paginationDto;
    try {
      const inscription = await prisma.inscriptions.findFirst({
        where: { studentId: idStundet },
        include: {
          student: {
            include: {
              user: true,
            },
          },
          staff: {
            include: {
              user: true,
            },
          },
          price: true,
        },
      });
      const { ...inscriptionEntity } = InscriptionEntity.fromObject(
        inscription!
      );
      return CustomSuccessful.response({ result: inscriptionEntity });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }
}
