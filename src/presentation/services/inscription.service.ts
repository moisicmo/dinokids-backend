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
            subject: true,
          },
        }),
      ]);

      return CustomSuccessful.response({
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
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createInscription(inscriptionDto: InscriptionDto, user: UserEntity) {
    try {
      const { ...createInscriptionDto } = inscriptionDto;
      const inscriptionExists = await prisma.inscriptions.findFirst({
        where: {
          student: {
            id: createInscriptionDto.studentId,
          },
        },
      });
      if (inscriptionExists)
        throw CustomError.badRequest('La inscripción ya existe');

      const inscription = await prisma.inscriptions.create({
        data: {
          ...createInscriptionDto,
          staffId: user.id,
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
          subject: true,
        },
      });
      const { ...inscriptionEntity } = await InscriptionEntity.fromObject(inscription);
      const document = await generatePdf(inscriptionEntity);
      return CustomSuccessful.response({
        result: {
          ...inscriptionEntity,
          document
        }
      });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateInscription(
    inscriptionDto: InscriptionDto,
    user: UserEntity,
    inscriptionId: number
  ) {
    try {
      const { ...updateInscriptionDto } = inscriptionDto;
      const existingInscriptionWithName = await prisma.inscriptions.findFirst({
        where: {
          AND: [
            {
              student: {
                id: updateInscriptionDto.studentId,
              },
            },
            {
              subject: {
                id: updateInscriptionDto.subjectId,
              },
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
          subject:true,
        },
      });
      if (!inscriptionExists)
        throw CustomError.badRequest('La inscripción no existe');

      const inscription = await prisma.inscriptions.update({
        where: { id: inscriptionId },
        data: {
          ...updateInscriptionDto,
          total: inscriptionDto.total,
        },
        include: {
          student: true,
          staff: true,
          subject:true,
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
        subject:true,
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
        include: {
          student: true,
          staff: true,
          subject:true,
        },
      });

      return CustomSuccessful.response({ message: 'Inscripción eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
