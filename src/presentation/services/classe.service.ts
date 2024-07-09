import { PrismaClient } from '@prisma/client';
import {
  CustomError,
  PaginationDto,
  UserEntity,
  CustomSuccessful,
  ClasseDto,
  ClasseEntity,
  PriceEntity,
} from '../../domain';

const prisma = new PrismaClient();

export class ClasseService {
  constructor() { }

  async getClasses(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, classes] = await Promise.all([
        prisma.classes.count({ where: { state: true } }),
        prisma.classes.findMany({
          where: {
            state: true,
          },
          include: {
            room: true,
            teacher: {
              include:{
                user:true,
              }
            },
            module: {
              include:{
                subject:true,
              }
            },
            price:true,
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
          next: `/api/classes?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/classes?page=${page - 1}&limit=${limit}`
              : null,
          classes: classes.map((classes) => {
            const { ...classesEntity } = ClasseEntity.fromObject(classes);
            return classesEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createClasses(createClassesDto: ClasseDto, user: UserEntity) {
    try {
      const {inscription,month,...dataClasses} = createClassesDto;
      const classes = await prisma.classes.create({
        data: {
          ...dataClasses,
        },
        include: {
          room: true,
          teacher: {
            include:{
              user:true,
            }
          },
          module: {
            include:{
              subject:true,
            }
          },
        },
      });
      const { ...classesEntity } = ClasseEntity.fromObject(classes);
      
      const price = await prisma.price.create({
        data:{
          classesId:classes.id,
          inscription,
          month
        }
      });
      const { ...priceEntity } = PriceEntity.fromObject(price);


      return CustomSuccessful.response({ result: {...classesEntity,...priceEntity} });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateClasses(
    updateClassesDto: ClasseDto,
    user: UserEntity,
    classesId: number
  ) {
    const ClassesExists = await prisma.classes.findFirst({
      where: { id: classesId },
    });
    if (!ClassesExists) throw CustomError.badRequest('La clase no existe');

    try {
      const classes = await prisma.classes.update({
        where: { id: classesId },
        data: {
          ...updateClassesDto,
        },
        include: {
          room: true,
          teacher: {
            include:{
              user:true,
            }
          },
          module: {
            include:{
              subject:true,
            }
          },
        },
      });
      const { ...classesEntity } = ClasseEntity.fromObject(classes);
      return CustomSuccessful.response({ result: classesEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteClasses(user: UserEntity, classesId: number) {
    const classesExists = await prisma.classes.findFirst({
      where: { id: classesId },
    });
    if (!classesExists) throw CustomError.badRequest('La clase no existe');
    try {
      await prisma.classes.update({
        where: { id: classesId },
        data: {
          state: false,
        },
        include: {
          room: true,
          teacher: {
            include:{
              user:true,
            }
          },
          module: {
            include:{
              subject:true,
            }
          },
        },
      });
      return CustomSuccessful.response({ message: 'Clase eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
