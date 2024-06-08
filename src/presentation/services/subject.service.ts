import { PrismaClient } from '@prisma/client';
import {
  CustomError,
  PaginationDto,
  UserEntity,
  SubjectDto,
  CustomSuccessful,
  SubjectEntity,
} from '../../domain';

const prisma = new PrismaClient();

export class SubjectService {
  constructor() { }

  async getSubjects(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, subjects] = await Promise.all([
        prisma.subjects.count({ where: { state: true } }),
        prisma.subjects.findMany({
          where: {
            state: true,
          },
          include: {
            category: true,
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
          next: `/api/subject?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/subject?page=${page - 1}&limit=${limit}`
              : null,
          subjects: subjects.map((subject) => {
            const { ...subjectEntity } = SubjectEntity.fromObject(subject);
            return subjectEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createSubject(createSubjectDto: SubjectDto, user: UserEntity) {
    const subjectExists = await prisma.subjects.findFirst({
      where: { name: createSubjectDto.name, state: true, },
    });
    if (subjectExists) throw CustomError.badRequest('La materia ya existe');

    try {
      const subject = await prisma.subjects.create({
        data: {
          ...createSubjectDto,
        },
        include: {
          category: true,
        },
      });

      const { ...subjectEntity } = SubjectEntity.fromObject(subject);
      return CustomSuccessful.response({ result: subjectEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateSubject(
    updateSubjectDto: SubjectDto,
    user: UserEntity,
    subjectId: number
  ) {
    const existingsubjectWithName = await prisma.subjects.findFirst({
      where: {
        AND: [{ name: updateSubjectDto.name }, { NOT: { id: subjectId } }],
      },
      include: {
        category: true,
      },
    });
    if (existingsubjectWithName)
      throw CustomError.badRequest('Ya existe una materia con el mismo nombre');

    const subjectExists = await prisma.subjects.findFirst({
      where: { id: subjectId },
    });
    if (!subjectExists) throw CustomError.badRequest('La materia no existe');

    try {
      const subject = await prisma.subjects.update({
        where: { id: subjectId },
        data: {
          ...updateSubjectDto,
        },
        include: {
          category: true,
        },
      });
      const { ...subjectEntity } = SubjectEntity.fromObject(subject);
      return CustomSuccessful.response({ result: subjectEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteSubject(user: UserEntity, subjectId: number) {
    const subjectExists = await prisma.subjects.findFirst({
      where: { id: subjectId },
    });
    if (!subjectExists) throw CustomError.badRequest('La materia no existe');
    try {
      await prisma.subjects.update({
        where: { id: subjectId },
        data: {
          state: false,
        },
        include: {
          category: true,
        },
      });
      return CustomSuccessful.response({ message: 'Materia eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
