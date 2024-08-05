import { PrismaClient } from '@prisma/client';
import {
  CustomError,
  CustomSuccessful,
  PaginationDto,
  RoomDto,
  RoomEntity,
  UserEntity,
} from '../../domain';

const prisma = new PrismaClient();

export class RoomService {
  constructor() {}

  async getRooms(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, rooms] = await Promise.all([
        prisma.rooms.count({ where: { state: true } }),
        prisma.rooms.findMany({
          where: {
            state: true,
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
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/room?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/room?page=${page - 1}&limit=${limit}`
              : null,
          rooms: rooms.map((room) => {
            const { ...roomEntity } = RoomEntity.fromObject(room);
            return roomEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createRoom(createRoomDto: RoomDto, user: UserEntity) {
    const roomExists = await prisma.rooms.findFirst({
      where: { name: createRoomDto.name, state: true },
    });
    if (roomExists) throw CustomError.badRequest('El aula ya existe');

    try {
      const room = await prisma.rooms.create({
        data: {
          ...createRoomDto,
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
      });

      const { ...roomEntity } = RoomEntity.fromObject(room);
      return CustomSuccessful.response({ result: roomEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateRoom(
    updateRoom: RoomDto,
    user: UserEntity,
    roomId: number
  ) {
    const existingRoomWithName = await prisma.rooms.findFirst({
      where: {
        AND: [{ name: updateRoom.name }, { NOT: { id: roomId } }],
      },
    });
    if (existingRoomWithName)
      throw CustomError.badRequest(
        'Ya existe un aula con el mismo nombre'
      );

    const roomExists = await prisma.rooms.findFirst({
      where: { id: roomId },
    });
    if (!roomExists) throw CustomError.badRequest('La aula no existe');

    try {
      const room = await prisma.rooms.update({
        where: { id: roomId },
        data: {
          ...updateRoom,
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
      });
      const { ...roomEntity } = RoomEntity.fromObject(room);
      return CustomSuccessful.response({ result: roomEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteRoom(user: UserEntity, roomId: number) {
    const roomExists = await prisma.rooms.findFirst({
      where: { id: roomId },
    });
    if (!roomExists) throw CustomError.badRequest('La aula no existe');
    try {
      await prisma.rooms.update({
        where: { id: roomId },
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
