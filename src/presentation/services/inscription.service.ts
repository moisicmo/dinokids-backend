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
            season: true,
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
      const season = await prisma.seasons.findFirst({
        where: { enableState: true },
        include: {
          stages: {
            include: {
              requirements: true,
            },
          },
        },
      });
      if (!season) throw CustomError.badRequest('Habilite una temporada');
      const { ...createInscriptionDto } = inscriptionDto;
      const inscriptionExists = await prisma.inscriptions.findFirst({
        where: {
          season: {
            id: season.id,
          },
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
          total: season.price,
          staffId: user.id,
          seasonId: season.id,
          returnedAmount: season.price - createInscriptionDto.amountDelivered,
          url: '',
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
          season: true,
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
      const season = await prisma.seasons.findFirst({
        where: { enableState: true },
        include: {
          stages: {
            include: {
              requirements: true,
            },
          },
        },
      });
      if (!season) throw CustomError.badRequest('Habilite una temporada');
      const { ...updateInscriptionDto } = inscriptionDto;
      const existingInscriptionWithName = await prisma.inscriptions.findFirst({
        where: {
          AND: [
            {
              season: {
                id: season.id,
              },
            },
            {
              student: {
                id: updateInscriptionDto.studentId,
              },
            },
            { NOT: { id: inscriptionId } },
          ],
        },
      });
      if (existingInscriptionWithName)
        throw CustomError.badRequest(
          'Ya existe una inscripción con el estudiante y en la misma temporada'
        );
      const inscriptionExists = await prisma.inscriptions.findFirst({
        where: { id: inscriptionId },
        include: {
          student: true,
          staff: true,
          season: true,
        },
      });
      if (!inscriptionExists)
        throw CustomError.badRequest('La inscripción no existe');

      const inscription = await prisma.inscriptions.update({
        where: { id: inscriptionId },
        data: {
          ...updateInscriptionDto,
          total: season.price,
          seasonId: season.id,
          returnedAmount: season.price - updateInscriptionDto.amountDelivered,
        },
        include: {
          student: true,
          staff: true,
          season: true,
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
        season: true,
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
          season: true,
        },
      });

      return CustomSuccessful.response({ message: 'Inscripción eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
