import { PrismaClient } from '@prisma/client';
import { bcryptAdapter, envs } from '../src/config';

async function main() {
  const prisma = new PrismaClient();

  try {

    const users = await prisma.users.createManyAndReturn({
      data: [
        {
          dni: envs.DNI,
          name: envs.NAME_SEED,
          lastName: envs.LAST_NAME_SEED,
          email: envs.EMAIL_SEED,
          phone: envs.PHONE_SEED,
          password: bcryptAdapter.hash(envs.EMAIL_SEED),
          emailValidated: true,
        },
        {
          dni: '8312123',
          name: 'Marco Luis',
          lastName: 'Chambi Mamani',
          email: 'marco@gmail.com',
          phone: '78782839',
          password: bcryptAdapter.hash('marco123'),
          emailValidated: true,
        },
        {
          dni: '9312134',
          name: 'Juan Carlos',
          lastName: 'Lopez Fernandez',
          email: 'juan.lopez@gmail.com',
          phone: '76543210',
          password: bcryptAdapter.hash('juan123'),
          emailValidated: true,
        },
        {
          dni: '7412589',
          name: 'Maria Isabel',
          lastName: 'Rodriguez Perez',
          email: 'maria@gmail.com',
          phone: '75432109',
          password: bcryptAdapter.hash('maria123'),
          emailValidated: true,
        },
        {
          dni: '8523697',
          name: 'Carlos Andres',
          lastName: 'Gomez Sanchez',
          email: 'carlos.gomez@gmail.com',
          phone: '74638290',
          password: bcryptAdapter.hash('carlos123'),
          emailValidated: true,
        },
        {
          dni: '9632587',
          name: 'Ana Lucia',
          lastName: 'Vargas Torres',
          email: 'ana.vargas@gmail.com',
          phone: '73452987',
          password: bcryptAdapter.hash('ana123'),
          emailValidated: true,
        },
        {
          dni: '1593578',
          name: 'Roberto Daniel',
          lastName: 'Fernandez Ruiz',
          email: 'roberto@gmail.com',
          phone: '75639812',
          password: bcryptAdapter.hash('roberto123'),
          emailValidated: true,
        },
        {
          dni: '4863792',
          name: 'Lucia Fernanda',
          lastName: 'Salazar Ortega',
          email: 'lucia@gmail.com',
          phone: '74923867',
          password: bcryptAdapter.hash('lucia123'),
          emailValidated: true,
        },
        {
          dni: '2764891',
          name: 'Miguel Angel',
          lastName: 'Cruz Rojas',
          email: 'miguel@gmail.com',
          phone: '73829465',
          password: bcryptAdapter.hash('miguel123'),
          emailValidated: true,
        },
        {
          dni: '9358174',
          name: 'Elena Maria',
          lastName: 'Gonzalez Herrera',
          email: 'elena@gmail.com',
          phone: '72619483',
          password: bcryptAdapter.hash('elena123'),
          emailValidated: true,
        },
        {
          dni: '3486712',
          name: 'David Esteban',
          lastName: 'Mendoza Paredes',
          email: 'david@gmail.com',
          phone: '73429186',
          password: bcryptAdapter.hash('david123'),
          emailValidated: true,
        },
      ],
      skipDuplicates: true,
    });

    const tutors = await prisma.users.createManyAndReturn({
      data: [
        {
          dni: '8405213',
          name: 'Alvaro Luis',
          lastName: 'Clever Alvarez',
          email: 'alvaro123@gmail.com',
          phone: '74003829',
          password: bcryptAdapter.hash('alvaro123'),
          emailValidated: true,
        },
        {
          dni: '9512369',
          name: 'Carlos Alberto',
          lastName: 'Pérez Gómez',
          email: 'carlos.perez@gmail.com',
          phone: '74003830',
          password: bcryptAdapter.hash('carlos123'),
          emailValidated: true,
        },
        {
          dni: '1597536',
          name: 'Marta Lucia',
          lastName: 'Ramirez Torres',
          email: 'marta.ramirez@gmail.com',
          phone: '74003831',
          password: bcryptAdapter.hash('marta123'),
          emailValidated: true,
        },
        {
          dni: '7539515',
          name: 'Diego Fernando',
          lastName: 'Gonzalez Soto',
          email: 'diego.gonzalez@gmail.com',
          phone: '74003832',
          password: bcryptAdapter.hash('diego123'),
          emailValidated: true,
        },
        {
          dni: '2589632',
          name: 'Sofia Isabel',
          lastName: 'Mendoza Castro',
          email: 'sofia.mendoza@gmail.com',
          phone: '74003833',
          password: bcryptAdapter.hash('sofia123'),
          emailValidated: true,
        },
        {
          dni: '3698524',
          name: 'Fernando Jose',
          lastName: 'Salazar Lopez',
          email: 'fernando.salazar@gmail.com',
          phone: '74003834',
          password: bcryptAdapter.hash('fernando123'),
          emailValidated: true,
        },
        {
          dni: '9513578',
          name: 'Ana Maria',
          lastName: 'Cruz Herrera',
          email: 'ana.cruz@gmail.com',
          phone: '74003835',
          password: bcryptAdapter.hash('ana123'),
          emailValidated: true,
        },
        {
          dni: '6547893',
          name: 'Jorge Luis',
          lastName: 'Torres Rojas',
          email: 'jorge.torres@gmail.com',
          phone: '74003836',
          password: bcryptAdapter.hash('jorge123'),
          emailValidated: true,
        },
        {
          dni: '7891235',
          name: 'Lucia Fernanda',
          lastName: 'Vargas Rivas',
          email: 'lucia.vargas@gmail.com',
          phone: '74003837',
          password: bcryptAdapter.hash('lucia123'),
          emailValidated: true,
        },
        {
          dni: '3216549',
          name: 'Roberto Carlos',
          lastName: 'Ramirez Morales',
          email: 'roberto.ramirez@gmail.com',
          phone: '74003838',
          password: bcryptAdapter.hash('roberto123'),
          emailValidated: true,
        },
        {
          dni: '8521476',
          name: 'Patricia Mariana',
          lastName: 'Gonzalez Herrera',
          email: 'patricia.gonzalez@gmail.com',
          phone: '74003839',
          password: bcryptAdapter.hash('patricia123'),
          emailValidated: true,
        },
        {
          dni: '9632588',
          name: 'Miguel Angel',
          lastName: 'Paz Flores',
          email: 'miguel.paz@gmail.com',
          phone: '74003840',
          password: bcryptAdapter.hash('miguel123'),
          emailValidated: true,
        },
        {
          dni: '7412589',
          name: 'Andrea Paola',
          lastName: 'Lopez Rivas',
          email: 'andrea.lopez@gmail.com',
          phone: '74003841',
          password: bcryptAdapter.hash('andrea123'),
          emailValidated: true,
        },
        {
          dni: '4567891',
          name: 'David Alejandro',
          lastName: 'Cruz Mendez',
          email: 'david.cruz@gmail.com',
          phone: '74003842',
          password: bcryptAdapter.hash('david123'),
          emailValidated: true,
        },
        {
          dni: '1472583',
          name: 'Evelyn Beatriz',
          lastName: 'Sánchez Castro',
          email: 'evelyn.sanchez@gmail.com',
          phone: '74003843',
          password: bcryptAdapter.hash('evelyn123'),
          emailValidated: true,
        },
        {
          dni: '2589631',
          name: 'Sebastian Andres',
          lastName: 'Maldonado Torres',
          email: 'sebastian.maldonado@gmail.com',
          phone: '74003844',
          password: bcryptAdapter.hash('sebastian123'),
          emailValidated: true,
        },
        {
          dni: '3698527',
          name: 'Camila Sofia',
          lastName: 'Morales Rivas',
          email: 'camila.morales@gmail.com',
          phone: '74003845',
          password: bcryptAdapter.hash('camila123'),
          emailValidated: true,
        },
        {
          dni: '7418520',
          name: 'Juan David',
          lastName: 'Sierra Salas',
          email: 'juan.sierra@gmail.com',
          phone: '74003846',
          password: bcryptAdapter.hash('juan123'),
          emailValidated: true,
        },
        {
          dni: '9517532',
          name: 'Natalia Andrea',
          lastName: 'Ocampo Flores',
          email: 'natalia.ocampo@gmail.com',
          phone: '74003847',
          password: bcryptAdapter.hash('natalia123'),
          emailValidated: true,
        },
        {
          dni: '7531598',
          name: 'Leonardo Javier',
          lastName: 'Lara Lopez',
          email: 'leonardo.lara@gmail.com',
          phone: '74003848',
          password: bcryptAdapter.hash('leonardo123'),
          emailValidated: true,
        },
        {
          dni: '9637414',
          name: 'Sabrina Estefania',
          lastName: 'Reyes Martinez',
          email: 'sabrina.reyes@gmail.com',
          phone: '74003849',
          password: bcryptAdapter.hash('sabrina123'),
          emailValidated: true,
        },
      ],
      skipDuplicates: true,
    });

    const students = await prisma.users.createManyAndReturn({
      data: [
        {
          dni: '8405213',
          name: 'Alvaro Luis',
          lastName: 'Clever Alvarez',
          email: 'alvaro123@gmail.com',
          phone: '74003829',
          password: bcryptAdapter.hash('alvaro123'),
          emailValidated: true,
        },
        {
          dni: '7512369',
          name: 'Jose Miguel',
          lastName: 'Lopez Martinez',
          email: 'jose.miguel@gmail.com',
          phone: '74102938',
          password: bcryptAdapter.hash('jose123'),
          emailValidated: true,
        },
        {
          dni: '6298531',
          name: 'Lucia Fernanda',
          lastName: 'Gomez Rivas',
          email: 'lucia.gomez@gmail.com',
          phone: '74203948',
          password: bcryptAdapter.hash('lucia123'),
          emailValidated: true,
        },
        {
          dni: '8401596',
          name: 'Mario Andres',
          lastName: 'Sanchez Castro',
          email: 'mario.sanchez@gmail.com',
          phone: '74301928',
          password: bcryptAdapter.hash('mario123'),
          emailValidated: true,
        },
        {
          dni: '7412589',
          name: 'Andrea Paola',
          lastName: 'Vargas Ortega',
          email: 'andrea.vargas@gmail.com',
          phone: '74401837',
          password: bcryptAdapter.hash('andrea123'),
          emailValidated: true,
        },
        {
          dni: '6392587',
          name: 'Daniel Esteban',
          lastName: 'Ramirez Chavez',
          email: 'daniel.ramirez@gmail.com',
          phone: '74502837',
          password: bcryptAdapter.hash('daniel123'),
          emailValidated: true,
        },
        {
          dni: '8523697',
          name: 'Patricia Mariana',
          lastName: 'Quispe Mamani',
          email: 'patricia.quispe@gmail.com',
          phone: '74601938',
          password: bcryptAdapter.hash('patricia123'),
          emailValidated: true,
        },
        {
          dni: '9637412',
          name: 'Jorge Luis',
          lastName: 'Mendoza Fernandez',
          email: 'jorge.mendoza@gmail.com',
          phone: '74702847',
          password: bcryptAdapter.hash('jorge123'),
          emailValidated: true,
        },
        {
          dni: '2581473',
          name: 'Gabriela Fernanda',
          lastName: 'Rivera Soto',
          email: 'gabriela.rivera@gmail.com',
          phone: '74801927',
          password: bcryptAdapter.hash('gabriela123'),
          emailValidated: true,
        },
        {
          dni: '3698521',
          name: 'Santiago Rafael',
          lastName: 'Torres Guzman',
          email: 'santiago.torres@gmail.com',
          phone: '74901827',
          password: bcryptAdapter.hash('santiago123'),
          emailValidated: true,
        },
        {
          dni: '7539512',
          name: 'Valeria Sofia',
          lastName: 'Ruiz Herrera',
          email: 'valeria.ruiz@gmail.com',
          phone: '75012938',
          password: bcryptAdapter.hash('valeria123'),
          emailValidated: true,
        },
      ],
      skipDuplicates: true,
    });

    const teachers = await prisma.users.createManyAndReturn({
      data: [
        {
          dni: '7401256',
          name: 'Fernando Manuel',
          lastName: 'Perez Garcia',
          email: 'fernando.perez@gmail.com',
          phone: '75203940',
          password: bcryptAdapter.hash('fernando123'),
          emailValidated: true,
        },
        {
          dni: '8520412',
          name: 'Carmen Patricia',
          lastName: 'Vega Lopez',
          email: 'carmen.vega@gmail.com',
          phone: '76304028',
          password: bcryptAdapter.hash('carmen123'),
          emailValidated: true,
        },
        {
          dni: '9630128',
          name: 'Luis Fernando',
          lastName: 'Reyes Martinez',
          email: 'luis.reyes@gmail.com',
          phone: '74102830',
          password: bcryptAdapter.hash('luis123'),
          emailValidated: true,
        },
        {
          dni: '7539128',
          name: 'Diana Carolina',
          lastName: 'Navarro Diaz',
          email: 'diana.navarro@gmail.com',
          phone: '75401839',
          password: bcryptAdapter.hash('diana123'),
          emailValidated: true,
        },
        {
          dni: '8471293',
          name: 'Jorge Alberto',
          lastName: 'Ruiz Santos',
          email: 'jorge.ruiz@gmail.com',
          phone: '74913028',
          password: bcryptAdapter.hash('jorge123'),
          emailValidated: true,
        },
        {
          dni: '9354782',
          name: 'Patricia Elena',
          lastName: 'Salinas Torres',
          email: 'patricia.salinas@gmail.com',
          phone: '74801929',
          password: bcryptAdapter.hash('patricia123'),
          emailValidated: true,
        },
        {
          dni: '2487356',
          name: 'Carlos Alberto',
          lastName: 'Rivera Mendoza',
          email: 'carlos.rivera@gmail.com',
          phone: '73891246',
          password: bcryptAdapter.hash('carlos123'),
          emailValidated: true,
        },
        {
          dni: '6547829',
          name: 'Ana Maria',
          lastName: 'Figueroa Rojas',
          email: 'ana.figueroa@gmail.com',
          phone: '72938102',
          password: bcryptAdapter.hash('ana123'),
          emailValidated: true,
        },
        {
          dni: '1579834',
          name: 'Jose Antonio',
          lastName: 'Ortega Velazquez',
          email: 'jose.ortega@gmail.com',
          phone: '73294829',
          password: bcryptAdapter.hash('jose123'),
          emailValidated: true,
        },
        {
          dni: '7831920',
          name: 'Marisol Teresa',
          lastName: 'Gonzalez Ruiz',
          email: 'marisol.gonzalez@gmail.com',
          phone: '72501920',
          password: bcryptAdapter.hash('marisol123'),
          emailValidated: true,
        }
      ],
      skipDuplicates: true,
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

    await prisma.branches.createManyAndReturn({
      data: [
        {
          name: 'Batallón Colorados',
          address: 'Batallón Colorados 1010',
          phone: '24629219'
        },
        {
          name: '20 de octubre',
          address: '20 de octubre 232',
          phone: '1234929'
        },
      ]
    },);

    await prisma.staffs.createManyAndReturn({
      data: users.map(user => ({
        userId: user.id,
        roleId: role.id,
        superStaff: true
      })),
    });

    const tutorsInTable = await prisma.tutors.createManyAndReturn({
      data: tutors.map(tutor => ({
        userId: tutor.id,
        address: 'La Paz, Miraflores, primera Av #234',
      }))
    });

    function getRandomDateIn2010() {
      const year = 2010;
      const month = Math.floor(Math.random() * 12);  // Random month from 0 to 11
      const day = Math.floor(Math.random() * 28) + 1;  // Random day from 1 to 28
      const hours = Math.floor(Math.random() * 24);    // Random hour from 0 to 23
      const minutes = Math.floor(Math.random() * 60);  // Random minute from 0 to 59
      const seconds = Math.floor(Math.random() * 60);  // Random second from 0 to 59

      return new Date(year, month, day, hours, minutes, seconds);
    }

    for (const student of students) {
      // Seleccionar dos tutores al azar
      const selectedTutors = [
        { id: tutorsInTable[students.indexOf(student) * 2]?.id },   // Primer tutor
        { id: tutorsInTable[students.indexOf(student) * 2 + 1]?.id }, // Segundo tutor
      ].filter(tutor => tutor.id); // Filtra si no hay suficientes tutores

      await prisma.students.create({
        data: {
          userId: student.id,
          code: student.dni,
          birthdate: getRandomDateIn2010(),
          gender: 'MALE',
          school: 'Sagrados Corazones',
          grade: 4,
          educationLevel: 'PRIMARY',
          tutors: {
            connect: selectedTutors,
          },
        },
      });
    }


    await prisma.specialties.createMany({
      data: [
        {
          name: 'Psicopedagogia',
          numberSessions: 280,
          estimatedSessionCost: 23,
        },
        {
          name: 'Fonología',
          numberSessions: 280,
          estimatedSessionCost: 23,
        },
        {
          name: 'Psicología Clínica',
          numberSessions: 300,
          estimatedSessionCost: 25,
        },
        {
          name: 'Terapia del Habla',
          numberSessions: 200,
          estimatedSessionCost: 20,
        },
        {
          name: 'Orientación Vocacional',
          numberSessions: 150,
          estimatedSessionCost: 22,
        },
        {
          name: 'Terapia Familiar',
          numberSessions: 250,
          estimatedSessionCost: 30,
        },
        {
          name: 'Psicopedagogía Infantil',
          numberSessions: 280,
          estimatedSessionCost: 24,
        },
        {
          name: 'Intervención Temprana',
          numberSessions: 180,
          estimatedSessionCost: 21,
        },
        {
          name: 'Educación Especial',
          numberSessions: 220,
          estimatedSessionCost: 23,
        },
        {
          name: 'Neuropsicología',
          numberSessions: 260,
          estimatedSessionCost: 26,
        },
      ],
    });


    await prisma.teachers.createManyAndReturn({
      data: teachers.map(teacher => ({
        userId: teacher.id,
      }))
    });

    console.log('Datos de semilla insertados correctamente.');
  } catch (error) {
    console.error('Error al insertar datos de semilla:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
