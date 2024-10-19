import { PrismaClient } from '@prisma/client';
import { TutorDto, CustomError, PaginationDto, UserEntity, TeacherEntity, CustomSuccessful, TutorEntity, } from '../../domain';
import { bcryptAdapter } from '../../config';

const prisma = new PrismaClient();

export class TutorService {

  constructor() { }

  async getTutors(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {

      const [total, tutors] = await Promise.all([
        prisma.tutors.count({ where: { state: true } }),
        prisma.tutors.findMany({
          where: {
            state: true,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: true,
          }
        }),
      ]);
      return CustomSuccessful.response({
        result: {
        page: page,
        limit: limit,
        total: total,
        next: `/api/tutor?page=${(page + 1)}&limit=${limit}`,
        prev: (page - 1 > 0) ? `/api/tutor?page=${(page - 1)}&limit=${limit}` : null,
        tutors: tutors.map(teacher => {
          const { ...teacherEntity } = TutorEntity.fromObject(teacher);
          return teacherEntity;
        })
      }});
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createTutor(dto: TutorDto, user: UserEntity) {

    try {

      const userExists = await prisma.users.findFirst({
        where: {
          email: dto.email
        }
      });

      let userId: number;
      if (!userExists) {
        const user = await prisma.users.create({
          data: {
            dni: dto.dni,
            name: dto.name,
            lastName: dto.lastName,
            email: dto.email,
            phone: dto.phone,
            password: await bcryptAdapter.hash(dto.email), // Hasheamos la contraseña
          },
        });
        userId = user.id;
      } else {
        userId = userExists.id;
      }

      const staffExists = await prisma.tutors.findFirst({
        where: {
          user: {
            email: dto.email
          },
          state: true
        }
      });

      if (staffExists) throw CustomError.badRequest('El tutor ya existe');

      const teacher = await prisma.tutors.create({
        data: {
          userId: userId,
          address: dto.address,
        },
        include: {
          user: true,
        }
      });
      console.log(teacher)


      const { ...teacherEntity } = TeacherEntity.fromObject(teacher);
      return CustomSuccessful.response({ result: teacherEntity });

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateTutor(dto: TutorDto, user: UserEntity, tutorId: number) {
    const teacherExists = await prisma.tutors.findFirst({
      where: { id: tutorId },
      include: {
        user: true,
      }
    });
    if (!teacherExists) throw CustomError.badRequest('El tutor no existe');

    try {

      await prisma.users.update({
        where: { id: teacherExists.userId },
        data: {
          ...dto,
          password: await bcryptAdapter.hash(teacherExists.user.password),
        }
      });

      const teacher = await prisma.tutors.update({
        where: { id: tutorId },
        data: {
          // ...updateTeacherDto,
        },
        include: {
          user: true,
        }
      });

      const { ...teacherEntity } = TeacherEntity.fromObject(teacher);
      return CustomSuccessful.response({ result: teacherEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteTutor(user: UserEntity, tutorId: number) {
    const tutorExists = await prisma.tutors.findFirst({
      where: { id: tutorId },
    });
    if (!tutorExists) throw CustomError.badRequest('El tutor no existe');
    try {
      await prisma.tutors.update({
        where: { id: tutorId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Tutor eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}


