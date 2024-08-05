import { PrismaClient } from '@prisma/client';
import { bcryptAdapter, envs } from '../src/config';

async function main() {
  const prisma = new PrismaClient();

  try {

    const user = await prisma.users.create({
      data: {
        dni: envs.DNI,
        name: envs.NAME_SEED,
        lastName: envs.LAST_NAME_SEED,
        email: envs.EMAIL_SEED,
        phone: envs.PHONE_SEED,
        password: bcryptAdapter.hash(envs.EMAIL_SEED),
        emailValidated: true,
      },
    });

    const role = await prisma.roles.create({
      data: {
        name: 'administrador',
        permissions: {
          create: [
            {
              name: 'crear',
              module: 'crear'
            },
            {
              name: 'editar',
              module: 'editar'
            }
          ]
        }
      }
    });

    await prisma.branches.create({
      data: {
        name: 'Batallón Colorados',
        address: 'Batallón Colorados 1010',
        phone: '24629219'
      }
    });

    await prisma.staffs.create({
      data: {
        userId: user.id,
        roleId: role.id,
        superStaff: true
      },
    });

    console.log('Datos de semilla insertados correctamente.');
  } catch (error) {
    console.error('Error al insertar datos de semilla:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
