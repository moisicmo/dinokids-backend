import { PrismaClient } from '@prisma/client';
import { TeacherDto, CustomError, PaginationDto, UserEntity, TeacherEntity, CustomSuccessful, } from '../../domain';
import { bcryptAdapter } from '../../config';

const prisma = new PrismaClient();

export class TeacherService {

  constructor() { }

  async getTeachers(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {

      const [total, teachers] = await Promise.all([
        prisma.teachers.count({ where: { state: true } }),
        prisma.teachers.findMany({
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
        next: `/api/teacher?page=${(page + 1)}&limit=${limit}`,
        prev: (page - 1 > 0) ? `/api/teacher?page=${(page - 1)}&limit=${limit}` : null,
        teachers: teachers.map(teacher => {
          const { ...teacherEntity } = TeacherEntity.fromObject(teacher);
          return teacherEntity;
        })
      }});
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createTeacher(createTeacherDto: TeacherDto, user: UserEntity) {

    try {

      const userExists = await prisma.users.findFirst({
        where: {
          email: createTeacherDto.email
        }
      });

      let userId: number;
      if (!userExists) {
        const user = await prisma.users.create({
          data: {
            dni: createTeacherDto.dni,
            name: createTeacherDto.name,
            lastName: createTeacherDto.lastName,
            email: createTeacherDto.email,
            phone: '5917373566',
            password: await bcryptAdapter.hash(createTeacherDto.email), // Hasheamos la contraseña
          },
        });
        userId = user.id;
      } else {
        userId = userExists.id;
      }

      const staffExists = await prisma.teachers.findFirst({
        where: {
          user: {
            email: createTeacherDto.email
          },
          state: true
        }
      });

      if (staffExists) throw CustomError.badRequest('El docente ya existe');

      const teacher = await prisma.teachers.create({
        data: {
          userId: userId,
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

  async updateTeacher(updateTeacherDto: TeacherDto, user: UserEntity, teacherId: number) {
    const teacherExists = await prisma.teachers.findFirst({
      where: { id: teacherId },
      include: {
        user: true,
      }
    });
    if (!teacherExists) throw CustomError.badRequest('El docente no existe');

    try {

      await prisma.users.update({
        where: { id: teacherExists.userId },
        data: {
          ...updateTeacherDto,
          password: await bcryptAdapter.hash(teacherExists.user.password),
        }
      });

      const teacher = await prisma.teachers.update({
        where: { id: teacherId },
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

  async deleteTeacher(user: UserEntity, categoryId: number) {
    const teacherExists = await prisma.teachers.findFirst({
      where: { id: categoryId },
    });
    if (!teacherExists) throw CustomError.badRequest('El docente no existe');
    try {
      await prisma.teachers.update({
        where: { id: categoryId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Docente eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}


