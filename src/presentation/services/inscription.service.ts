import { PrismaClient } from '@prisma/client';
import {
  CustomError,
  PaginationDto,
  UserEntity,
  InscriptionDto,
  InscriptionEntity,
  CustomSuccessful,
  RoomEntity,
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
            assignmentRooms: {
              include: {
                rooms: {
                  include: {
                    branch: true,
                    specialty: true,
                    teacher: {
                      include: {
                        user: true,
                      }
                    },
                  },
                },
                assignmentSchedules: {
                  include: {
                    schedules: true
                  }
                }
              }
            }
          },
        }),
      ]);
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
      console.log(error);
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createInscription(dto: InscriptionDto, user: UserEntity) {
    try {
      const { inscription, month, branch, ...dtoInscription } = dto;
      const inscriptionExists = await prisma.inscriptions.findFirst({
        where: {
          studentId: dtoInscription.student.id,
          assignmentRooms: {
            some: {
              roomId: {
                in: dtoInscription.rooms.map(room => room.id)
              }
            }
          }
        },
      });
      // if (inscriptionExists) throw CustomError.badRequest('La inscripción ya existe');
      const newPrice = await prisma.price.create({
        data: {
          inscription: inscription,
          month: month,
        },
      });
      const newInscription = await prisma.inscriptions.create({
        data: {
          studentId: dtoInscription.student.id,
          staffId: user.id,
          priceId: newPrice.id,
          total: 100,
        },
      });
      for (const room of dtoInscription.rooms) {
        const newAssignmentRoom = await prisma.assignmentRooms.create({
          data: {
            inscriptionId: newInscription.id,
            roomId: room.id,
          }
        });
        for (const event of room.eventSelects) {
          await prisma.assignmentSchedules.create({
            data: {
              assignmentRoomId: newAssignmentRoom.id,
              scheduleId: event.data.id,
              day: event.day
            }
          })

        }
      }
      const getInscription = await prisma.inscriptions.findFirst({
        where: {
          id: newInscription.id
        },
        include: {
          student: {
            include: {
              user: true,
              tutors: {
                include: {
                  user: true,
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
          monthlyFee: {
            include: {
              invoices: true,
            },
          },
          assignmentRooms: {
            include: {
              rooms: {
                include: {
                  branch: true,
                  specialty: true,
                  teacher: {
                    include: {
                      user: true,
                    }
                  },
                },
              },
              assignmentSchedules: {
                include: {
                  schedules: true
                }
              }
            }
          }
        },

      })
      const { ...inscriptionEntity } = await InscriptionEntity.fromObject(
        getInscription!
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
              studentId: updateInscriptionDto.student.id,
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
          assignmentRooms: {
            include: {
              // room: {
              //   include:{
              //     branch:true,
              //     specialty: true,
              //     teacher: {
              //       include:{
              //         user:true,
              //       }
              //     },
              //   },
              // },
              // schedule:true,
            }
          }
          // rooms: true,
        },
      });
      if (!inscriptionExists)
        throw CustomError.badRequest('La inscripción no existe');

      const inscription = await prisma.inscriptions.update({
        where: { id: inscriptionId },
        data: {
          // ...updateInscriptionDto,
          studentId: updateInscriptionDto.student.id,
          staffId: user.id,
          // priceId: newPrice.id,
          // rooms: {
          //   disconnect: inscriptionExists.rooms.map((permission) => ({
          //     id: permission.id,
          //   })),
          //   connect: dto.rooms.map((room) => ({ id: room.id })),
          // },
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
          // rooms: {
          //   include:{
          //     branch:true,
          //     specialty: true,
          //     teacher: {
          //       include:{
          //         user:true,
          //       }
          //     },
          //   },
          // }
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
