import { PrismaClient } from '@prisma/client';
import {
  StudentDto,
  CustomError,
  PaginationDto,
  UserEntity,
  StudentEntity,
  CustomSuccessful,
} from '../../domain';
import { bcryptAdapter } from '../../config';

const prisma = new PrismaClient();

export class StudentService {
  constructor() {}

  async getStudents(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, students] = await Promise.all([
        prisma.students.count({ where: { state: true } }),
        prisma.students.findMany({
          where: {
            state: true,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: true,
          },
        }),
      ]);
      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/student?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/student?page=${page - 1}&limit=${limit}`
              : null,
          students: students.map((student) => {
            const { ...studentEntity } = StudentEntity.fromObject(student);
            return studentEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createStudent(createStudentDto: StudentDto, user: UserEntity) {
    try {
      const userExists = await prisma.users.findFirst({
        where: {
          email: createStudentDto.email,
        },
      });

      let userId: number;
      if (!userExists) {
        const user = await prisma.users.create({
          data: {
            name: createStudentDto.name,
            lastName: createStudentDto.lastName,
            email: createStudentDto.email,
            phone: '5917373566',
            password: await bcryptAdapter.hash(createStudentDto.email), // Hasheamos la contraseña
          },
        });
        userId = user.id;
      } else {
        userId = userExists.id;
      }

      const staffExists = await prisma.students.findFirst({
        where: {
          user: {
            email: createStudentDto.email,
          },
          state: true,
        },
      });

      if (staffExists) throw CustomError.badRequest('El estudiante ya existe');

      const student = await prisma.students.create({
        data: {
          code: createStudentDto.code,
          userId: userId,
        },
        include: {
          user: true,
        },
      });
      console.log(student);

      const { ...studentEntity } = StudentEntity.fromObject(student);
      return CustomSuccessful.response({ result: studentEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateStudent(
    updateStudentDto: StudentDto,
    user: UserEntity,
    studentId: number
  ) {
    const studentExists = await prisma.students.findFirst({
      where: { id: studentId },
      include: {
        user: true,
      },
    });
    if (!studentExists) throw CustomError.badRequest('El estudiante no existe');

    try {
      await prisma.users.update({
        where: { id: studentExists.userId },
        data: {
          ...updateStudentDto,
          password: await bcryptAdapter.hash(studentExists.user.password),
        },
      });

      const student = await prisma.students.update({
        where: { id: studentId },
        data: {
          ...updateStudentDto,
        },
        include: {
          user: true,
        },
      });

      const { ...studentEntity } = StudentEntity.fromObject(student);
      return CustomSuccessful.response({ result: studentEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteStudent(user: UserEntity, categoryId: number) {
    const studentExists = await prisma.students.findFirst({
      where: { id: categoryId },
    });
    if (!studentExists) throw CustomError.badRequest('El estudiante no existe');
    try {
      await prisma.students.update({
        where: { id: categoryId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Estudiante eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getStudent(studentId: number) {
    try {
      const student = await prisma.students.findFirst({where: {id: studentId}})
      return CustomSuccessful.response({
        result: {
          student
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }
}
