const pdfMakeX = require('pdfmake');
import { format } from 'date-fns';
import esES from 'date-fns/locale/es';
import fs from 'fs';
import path from 'path';
import { InscriptionEntity } from '../../../domain';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

const calculateAge = (birthdate: Date): number => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Si el mes actual es anterior al mes de nacimiento, o es el mismo pero el día es anterior, restamos un año
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const generateTable = (
  label: string,
  value: string,
  isSmallWidth: boolean = false // Parámetro opcional para ajustar el tamaño de la línea
): any => {
  // Función para generar la línea de subrayado
  const generateLine = (isSmallWidth: boolean): string => {
    // Usamos una longitud más corta si isSmallWidth es true
    const lineLength = isSmallWidth ? 10 : 20; // Ajustar los valores según se necesite
    return '_'.repeat(lineLength);
  };

  return {
    table: {
      widths: ['*'],
      body: [
        [
          {
            text: value,
            style: 'styleCenter',
            margin: [0, 0, 0, -5], // Reducimos el margen inferior del primer texto
            lineHeight: 1,
          },
        ],
        [
          {
            text: generateLine(isSmallWidth), // Genera la línea subrayada proporcional
            style: 'styleCenter',
            margin: [0, -5, 0, 0], // Reducimos el margen superior de la línea
            lineHeight: 1,
          },
        ],
        [{ text: label, style: 'styleCenter', margin: [0, 0, 0, 0], lineHeight: 1 }],
      ],
    },
    layout: 'noBorders',
  };
};



export const generatePdf = async (inscriptionEntity: InscriptionEntity) => {
  const fonts = {
    Roboto: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  };

  const printer = new pdfMakeX(fonts);

  // Read the image from the file system
  const imagePath = path.join(__dirname, '../../../../assets/logo.png');
  const imageBase64 = fs.readFileSync(imagePath).toString('base64');

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'LETTER',
    pageMargins: [40, 50, 40, 50],
    defaultStyle: {
      fontSize: 12,
    },
    content: [
      {
        margin: [0, 30, 5, 0],
        layout: 'noBorders',
        table: {
          widths: ['*'], // Solo una columna para centrar el texto
          body: [
            [
              {
                margin: [0, 0, 0, 0],
                text: 'Ficha de Inscripción',
                fontSize: 24,
                alignment: 'center', // Centramos el texto
                bold: true,
              },
            ],
          ],
        },
      },
      {
        image: `data:image/png;base64,${imageBase64}`,
        width: 100, // Ajusta el tamaño de la imagen según sea necesario
        absolutePosition: { x: 450, y: 30 }, // Posiciona la imagen en la esquina superior derecha
        margin: [0, 0, 0, 0],
      },
      {
        margin: [0, 30, 5, 0],
        layout: 'noBorders',
        table: {
          widths: ['*', '20%'],
          body: [
            [
              {
                text: 'Correspondiente este documento al número de cliente:',
                style: 'stylePagrafer',
              },
              {
                text: 'Cod: 14151617',
                style: 'stylePagrafer',
              },
            ],
          ],
        },
      },
      {
        text: [
          { text: 'Primera: DINO KIDS - ', bold: true }, // Negrita solo para esta parte
          { text: 'Desarrollo Infantil Neuro Psicológico Orientado se se compromete a lo siguiente:' }, // Texto normal
        ],
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '1.- Brindar evaluaciones periódicas, para tratar dificultades de aprendizaje utilizando un método de capacitación 100% garantizado adecuado a cada caso.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '2.- El programa es anual, sin embargo el tiempo de duración de cada módulo es de 6 meses.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '3.- Al finalizar el programa se le otorgara un informe de avanze y/o resultados.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: [
          { text: 'Segunda:', bold: true }, // Negrita solo para esta parte
          { text: ' - Los datos del titular y del alumno son:' }, // Texto normal
        ],
        style: 'stylePagrafer',
      },
      {
        margin: [0, 20, 0, 0],
        text: 'Datos del tutor:',
        bold: true,
      },
      {
        margin: [0, 10, 5, 0],
        layout: 'noBorders',
        table: {
          widths: ['*', '*'],
          body: [
            [
              generateTable(
                'Nombre del tutor',
                `${inscriptionEntity.student?.tutors![0].name} ${inscriptionEntity.student?.tutors![0].lastName}`
              ),
              generateTable(
                'Celular',
                `${inscriptionEntity.student?.tutors![0].phone}`
              ),
            ],
          ],
        },
      },
      {
        margin: [0, 10, 5, 0],
        layout: 'noBorders',
        table: {
          widths: ['*', '*'],
          body: [
            [
              generateTable(
                'Dirección',
                `${inscriptionEntity.student?.tutors![0].address}`
              ),
              generateTable(
                'Celular de Ref.',
                `${inscriptionEntity.student?.tutors![0].phone}`
              ),
            ],
          ],
        },
      },
      {
        margin: [0, 20, 0, 0],
        text: 'Datos del estudiante:',
        bold: true,
      },
      {
        margin: [0, 10, 5, 0],
        layout: 'noBorders',
        table: {
          widths: ['*', '10%', '*', '20%'],
          body: [
            [
              generateTable(
                'Nombre del estudiante',
                `${inscriptionEntity.student?.name} ${inscriptionEntity.student?.lastName}`
              ),
              generateTable(
                'Edad',
                `${calculateAge(inscriptionEntity.student!.birthdate)} años`,
                true,
              ),
              generateTable(
                'Fecha de nacimiento',
                `${format(
                  new Date(inscriptionEntity.student!.birthdate),
                  'dd-MMMM-yyyy',
                  { locale: esES }
                )}`
              ),
              generateTable('Sexo', `${inscriptionEntity.student!.gender}`, true),
            ],
          ],
        },
      },
      {
        margin: [0, 20, 0, 0],
        text: 'Datos del programa:',
        bold: true,
      },
      inscriptionEntity.assignmentRooms!.map(room => ({
        margin: [0, 0, 5, 0], // Márgenes válidos (4 elementos)
        layout: 'noBorders',
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            [
              generateTable('Programa', `${room.room?.specialty?.name}`), // Cambia esto según tu lógica
              generateTable(
                'Inicio de sesión',
                `${format(new Date(), 'dd-MMMM-yyyy', { locale: esES })}`
              ),
              generateTable('Módulo', `1er módulo`),
              generateTable('Sesiones', `${room.room?.specialty?.numberSessions}`, true),
            ],
          ],
        },
      })),
      {
        margin: [0, 20, 0, 0],
        text: [
          { text: 'Método de pago:', bold: true }, // Negrita solo para esta parte
          { text: '    Plan Mensual' }, // Texto normal
        ],
        style: 'stylePagrafer',
      },
      {
        margin: [0, 20, 0, 0],
        text: 'Los pagos se deben realizarse hasta el 5 de cada mes.',
      },
      {
        margin: [0, 20, 0, 0],
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: '____________________',
                style: 'styleCenter',
              },
            ],
            [{
              margin: [0, -5, 0, 0],
              text: 'Firma del tutor principal', style: 'styleCenter' }],
            [{
              margin: [0, -5, 0, 0],
              text: `${inscriptionEntity.student?.tutors![0].name} ${inscriptionEntity.student?.tutors![0].lastName}`, style: 'styleCenter' }],
          ],
        },
        layout: 'noBorders',
      },
      { text: '', pageBreak: 'after' },
      {
        margin: [0, 0, 5, 0],
        layout: 'noBorders',
        table: {
          widths: ['30%', '*'],
          body: [
            [
              {
                table: {
                  widths: ['*'],
                  body: [
                    [
                      {
                        text: `DINO KIDS. 4758808011`,
                        alignment: 'justify',
                        fontSize: 9,
                        bold: true,
                      },
                    ],
                    [
                      {
                        text: `Calle Batallón Colorados`,
                        alignment: 'justify',
                        fontSize: 9,
                      },
                    ],
                    [
                      {
                        text: `Edificio Batallón Colorados Efic. 4`,
                        alignment: 'justify',
                        fontSize: 9,
                      },
                    ],
                    [
                      {
                        text: `www.dinokids.com.bo`,
                        alignment: 'justify',
                        fontSize: 9,
                        decoration: 'underline',
                      },
                    ],
                  ],
                },
                layout: 'noBorders',
              },
              {
                table: {
                  widths: ['*'],
                  body: [
                    [
                      {
                        margin: [0, 0, 10, 0], // Ajustar el margen superior a 0 para alinear al tope
                        text: `Carta de compromiso`,
                        bold: true,
                        fontSize: 24,
                        alignment: 'right',
                        valign: 'top', // Alinear al tope
                      },
                    ],
                    [
                      {
                        margin: [0, 0, 10, 0], // Ajustar el margen superior a 0 para alinear al tope
                        text: `con el reglamento interno`,
                        bold: true,
                        fontSize: 24,
                        alignment: 'right',
                        valign: 'top', // Alinear al tope
                      },
                    ],
                  ],
                },
                layout: 'noBorders',
              },
            ],
          ],
        },
      },

      {
        margin: [0, 10, 0, 0],
        text: `Yo ${inscriptionEntity.student?.tutors![0].name} ${inscriptionEntity.student?.tutors![0].lastName} con C.I: ${inscriptionEntity.student?.tutors![0].dni} Padre/Madre/Tutor del estudiante ${inscriptionEntity.student?.name} ${inscriptionEntity.student?.lastName}.`,
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: [
          { text: 'Quien desde la fecha forma parte del centro ' },
          { text: 'DINO KIDS', bold: true },
          { text: ' como inscrito. Con el proposito de garantizar el mejor desarrollo de las actividades dentro del centro, me comprometo a cumplir con los siguientes puntos con el fin de promover el proceso de reeducación al que accede el menor:' }, // Texto normal
        ],
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '- Los tutores o padres de familia deberán portar la credencial al momento de dejar y recoger a su ninó de manera obligatoria',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '- De no portar la credencial la persona que lo recoja deberá portar su carnet de identidad tanto original como fotocopia y llenar un formulario donde nos brindará todos los datos solicitados en el momento con la finalidad de precautelar la seguridad de los niños.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '- Ser puntual en el ingreso y salida de cada niño o niña dentro de las sesiones recibidas.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: [
          { text: '- No faltar a las sesiones programadas según el horario, leer el apartado 2.3. del Reglamento General Estudiantil ' },
          { text: 'DINO KIDS', bold: true }, // Negrita solo para esta parte
          { text: '. Considerando que la inasistencia a las sesiones entorpece el avance y progreso del niño o niña y retrocede el mismo alcanzado.' }, // Texto normal
        ],
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '- los Permisos serán concedidos una vez al mes y el mismo podrá ser repuesto previa coordinación de horarios.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '- En caso de permisos por enfermedad, el mismo debe ser respaldado para que las sesiones sean repuestas previa coordinación de días y horarios.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '- No enviar alimentos al momento de participar en las sesiones o ingreso a aulas, savlo petición expresa de la educadora. Con el fin de mantener la higiene y seguridad dentro de las aulas.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '- Pagar las mensualidades en las fechas indicadas, según el plan de pagos acordado con el asesor. De lo contrario se restringe el ingreso a las sesiones programadas.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },

      {
        text: [
          { text: '- Fomentar el buen comportamiento de su niño dentro de las actividades del centro ' },
          { text: 'DINO KIDS', bold: true },
          { text: ', evitando así inconvenientes entre los miembros del centro ' },
          { text: 'DINO KIDS', bold: true },
          { text: ' y el resto del alumnado.' },
        ],
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '- Formar parte de la Red de Apoyo que se formara entre, la educadora, la unidad educativa y el entorno familiar.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '- Participar en las entrevistas programadas, para un buen seguimiento al desarrollo y progreso de su niño, así mismo, informar oportunamente de alguna observación respecto a las sesiones desarrolladas.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '- Todo cambio de horario deberá ser solicitado y autorizado solo por el tutor o titular de la inscripción. Previo llenado y firma del Formulario correspondiente.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '- Evitar interrumpir el desarrollo de las sesiones y metodologías empleadas dentro de las actividades del niño, ya que toda actividad estará siempre orientada hacia el respeto y desarrollo adecuado del niño.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: [
          { text: '- Bajo el cumplimiento de cada uno de los puntos existentes en el presente compromiso, el Centro ' },
          { text: 'DINO KIDS', bold: true },
          { text: ' ogrece los siguientes beneficios:' }, // Texto normal
        ],
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: [
          { text: '- Material didáctico exclusivo desarrollado por la línea de juegos y juguetes ' }, // Texto normal
          { text: 'DINO TOYS', bold: true },
          { text: '.' }, // Texto normal
        ],
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '- Entrega de los informes de seguimiento y de avance den las fechas acordadas.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: [
          { text: '- En caso de ser solicitado el centro podrá emitir una carta de participación en el centro ' },
          { text: 'DINO KIDS', bold: true },
          { text: ' la misma podrá ser presentada en su unidad enducativa.' }, // Texto normal
        ],
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '- En caso de no contar con faltas en todo el programa adquirido, el niño será acreedor de 1 sesión extra al mes sin costo. La misma debe ser programada.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: [
          { text: '- Brindar acceso a la herramienta digital de ' },
          { text: 'DINO KIDS', bold: true },
          { text: ', en su página web ' }, // Texto normal
          { text: 'DINO LECTURA', bold: true },
          { text: ', como una herramienta que fomenta el desarrollo de la lectura para niños.' }, // Texto normal
        ],
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: [
          { text: '- Membresia gratuita a ' },
          { text: 'DINO CLUB', bold: true },
          { text: ', el cual conlleva actividades extracurriculares organizadas de manera eventual por el centro ' }, // Texto normal
          { text: 'DINO KIDS', bold: true },
          { text: '.' }, // Texto normal
        ],
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: '- Contar con profesionales calificados en cada una de las áreas para brindar un proceso educativo respetuoso, adecuado y acorde a cada niño o niña.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: [
          { text: 'Con la firma de este convenio el centro ' },
          { text: 'DINO KIDS', bold: true },
          { text: ' y en colaboración de nuestro Reglamento General Estudiantil busca una mejor comunicación y aceptación de las actividades para el desarrollo adecuado de su niño o niña. Bajo los procesos de información oportuna, comunicación y continuidad en el proceso de aprendizaje, mejora y educación según la necesidad de cada uno de los niños.' }, // Texto normal
        ],
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        text: 'Realizada la inscripción no se aceptan devoluciones.',
        style: 'stylePagrafer',
        alignment: 'justify',
      },
      {
        margin: [0, 10, 0, 0],
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: '____________________',
                style: 'styleCenter',
              },
            ],
            [{
              margin: [0, -5, 0, 0],
              text: 'Firma del tutor principal', style: 'styleCenter',
            }],
            [{
              margin: [0, -5, 0, 0],
              text: `${inscriptionEntity.student?.tutors![0].name} ${inscriptionEntity.student?.tutors![0].lastName}`, style: 'styleCenter' }],
          ],
        },
        layout: 'noBorders',
      },
    ],
    styles: {
      stylePagrafer: {
        margin: [0, 0, 0, 0],
        lineHeight: 1.5,
        fontSize: 9,
      },
      styleCenter: {
        alignment: 'center',
        fontSize: 12,
        margin: [0, 0, 0, 0],
        lineHeight: 1.5,
      },
      styleLeft: {
        alignment: 'left',
      },
      styleRight: {
        alignment: 'right',
      },
      styleLineCentered: {
        alignment: 'center',
        fontSize: 12,
      },
    },
  };

  return new Promise((resolve, reject) => {
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    let chunks: Buffer[] = [];
    pdfDoc.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    pdfDoc.on('end', async () => {
      const pdfData = Buffer.concat(chunks);
      const pdfBase64 = pdfData.toString('base64');
      resolve({ pdfBase64 });
    });
    pdfDoc.end();
  });
};
