import { DayOfWeek, PrismaClient } from '@prisma/client';
import {
  CustomError,
  CustomSuccessful,
  PaginationDto,
  ScheduleDto,
  ScheduleEntity,
  UserEntity,
} from '../../domain';

const prisma = new PrismaClient();

export class ScheduleService {
  constructor() {}

  async getSchedules(paginationDto: PaginationDto, roomId: number) {
    const { page, limit } = paginationDto;
    try {
      const [total, schedules] = await Promise.all([
        prisma.schedules.count({ where: { state: true } }),
        prisma.schedules.findMany({
          where: {
            state: true,
            roomId: roomId,
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
          next: `/api/schedule?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/schedule?page=${page - 1}&limit=${limit}`
              : null,
          schedules: schedules.map((room) => {
            const { ...roomEntity } = ScheduleEntity.fromObject(room);
            return roomEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createSchedule(createRoomDto: ScheduleDto, user: UserEntity) {
    const roomExists = await prisma.schedules.findFirst({
      where: {
        ...createRoomDto,
        state: true,
      },
    });
    if (roomExists) throw CustomError.badRequest('El horario ya existe');
    try {
      const schedule = await prisma.schedules.create({
        data: {
          ...createRoomDto,
        },
      });

      const { ...scheduleEntity } = ScheduleEntity.fromObject(schedule);
      return CustomSuccessful.response({ result: scheduleEntity });
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateSchedule(
    updateRoom: ScheduleDto,
    user: UserEntity,
    scheduleId: number
  ) {
    const existingRoomWithName = await prisma.schedules.findFirst({
      where: {
        // AND: [{ name: updateRoom.name }, { NOT: { id: roomId } }],
      },
    });
    if (existingRoomWithName)
      throw CustomError.badRequest('Ya existe un aula con el mismo nombre');

    const roomExists = await prisma.schedules.findFirst({
      where: { id: scheduleId },
    });
    if (!roomExists) throw CustomError.badRequest('La aula no existe');

    try {
      const room = await prisma.schedules.update({
        where: { id: scheduleId },
        data: {
          ...updateRoom,
        },
        include: {
          // branch:true,
        },
      });
      const { ...roomEntity } = ScheduleEntity.fromObject(room);
      return CustomSuccessful.response({ result: roomEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteSchedule(user: UserEntity, scheduleId: number) {
    const roomExists = await prisma.schedules.findFirst({
      where: { id: scheduleId },
    });
    if (!roomExists) throw CustomError.badRequest('La aula no existe');
    try {
      await prisma.schedules.update({
        where: { id: scheduleId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Aula eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
