import { PrismaClient } from '@prisma/client';
import {
  CustomError,
  PaginationDto,
  UserEntity,
  ProjectDto,
  ProjectEntity,
  CustomSuccessful,
} from '../../domain';
import { projectFollowingXlsx } from '../../config';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export class ProjectService {
  constructor() {}

  async getProjects(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, projects] = await Promise.all([
        prisma.projects.count({ where: { state: true } }),
        prisma.projects.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: {
            state: true,
          },
          include: {
            category: true,
            typeProject: true,
            students: {
              include: {
                user: true,
              },
            },
            season: {
              include: {
                stages: {
                  include: {
                    requirements: true,
                  },
                },
              },
            },
            staff: {
              include: {
                user: true,
              },
            },
            projectHistories: true,
            parallels: {
              include: {
                subject: true,
                teacher: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        }),
      ]);

      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/project?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/project?page=${page - 1}&limit=${limit}`
              : null,
          projects: projects.map((project) => {
            const { ...projectEntity } = ProjectEntity.fromObject(project);
            return projectEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async getDocumentXlsx(user: UserEntity, projectId: number) {
    try {
      const project = await prisma.projects.findFirst({
        where: { id: projectId },
        include: {
          category: true,
          typeProject: true,
          students: {
            include: {
              user: true,
            },
          },
          season: {
            include: {
              stages: {
                include: {
                  requirements: true,
                },
              },
            },
          },
          staff: {
            include: {
              user: true,
            },
          },
          projectHistories: true,
          parallels: {
            include: {
              subject: true,
              teacher: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
      if (!project) throw CustomError.badRequest('No existe el proyecto');

      const projectEntity = ProjectEntity.fromObject(project);
      const document = await projectFollowingXlsx(projectEntity);
      return document; // Devolver directamente el Uint8Array del archivo Excel
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createProject(projectDto: ProjectDto, user: UserEntity) {
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
      const { students, parallels, ...createProjectDto } = projectDto;
      const projectExists = await prisma.projects.findFirst({
        where: { title: createProjectDto.title },
      });
      if (projectExists) throw CustomError.badRequest('El proyecto ya existe');

      const project = await prisma.projects.create({
        data: {
          ...createProjectDto,
          staffId: user.id,
          seasonId: season.id,
          code: uuidv4(),
          students: {
            connect: students.map((studentId) => ({ id: studentId })),
          },
          parallels: {
            connect: parallels.map((parallelId) => ({ id: parallelId })),
          },
        },
        include: {
          category: true,
          typeProject: true,
          students: {
            include: {
              user: true,
            },
          },
          season: {
            include: {
              stages: {
                include: {
                  requirements: true,
                },
              },
            },
          },
          staff: {
            include: {
              user: true,
            },
          },
          projectHistories: true,
          parallels: {
            include: {
              subject: true,
              teacher: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      const { ...projectEntity } = ProjectEntity.fromObject(project!);
      const document = await projectFollowingXlsx(projectEntity);
      return CustomSuccessful.response({
        result: { ...projectEntity, document },
      });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateProject(
    projectDto: ProjectDto,
    user: UserEntity,
    projectId: number
  ) {
    try {
      const { students, parallels, ...updateProjectDto } = projectDto;
      const existingProjectWithName = await prisma.projects.findFirst({
        where: {
          AND: [{ title: updateProjectDto.title }, { NOT: { id: projectId } }],
        },
      });
      if (existingProjectWithName)
        throw CustomError.badRequest(
          'Ya existe un proyecto con el mismo nombre'
        );
      const projectExists = await prisma.projects.findFirst({
        where: { id: projectId },
        include: {
          category: true,
          typeProject: true,
          students: {
            include: {
              user: true,
            },
          },
          season: {
            include: {
              stages: {
                include: {
                  requirements: true,
                },
              },
            },
          },
          staff: {
            include: {
              user: true,
            },
          },
          projectHistories: true,
          parallels: {
            include: {
              subject: true,
              teacher: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
      if (!projectExists) throw CustomError.badRequest('El proyecto no existe');

      const project = await prisma.projects.update({
        where: { id: projectId },
        data: {
          ...updateProjectDto,
          students: {
            disconnect: projectExists.students.map((student) => ({
              id: student.id,
            })),
            connect: students.map((studentId) => ({ id: studentId })),
          },

          parallels: {
            disconnect: projectExists.parallels.map((parallel) => ({
              id: parallel.id,
            })),
            connect: parallels.map((parallelId) => ({ id: parallelId })),
          },
        },
        include: {
          category: true,
          typeProject: true,
          students: true,
          season: true,
          staff: true,
          projectHistories: true,
        },
      });
      const { ...projectEntity } = ProjectEntity.fromObject(project!);
      return CustomSuccessful.response({ result: projectEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteProject(user: UserEntity, projectId: number) {
    const projectExists = await prisma.projects.findFirst({
      where: { id: projectId },
      include: {
        category: true,
        typeProject: true,
        students: true,
        season: true,
        staff: true,
        projectHistories: true,
      },
    });
    if (!projectExists) throw CustomError.badRequest('El proyecto no existe');
    try {
      await prisma.projects.update({
        where: { id: projectId },
        data: {
          state: false,
        },
        include: {
          category: true,
          typeProject: true,
          students: true,
          season: true,
          staff: true,
          projectHistories: true,
        },
      });

      return CustomSuccessful.response({ message: 'Proyecto eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
