const pdfMakeX = require('pdfmake');
import { format } from 'date-fns';
import esES from 'date-fns/locale/es';
import fs from 'fs';
import path from 'path';
import { InscriptionEntity } from '../../../domain';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

const generateTable = (label: string, value: string): any => ({
  table: {
    widths: ['*'],
    body: [
      [{ text: value, style: 'styleCenter' }],
      [
        {
          text: '____________________',
          style: 'styleCenter',
        },
      ],
      [{ text: label, style: 'styleCenter' }],
    ],
  },
  layout: 'noBorders',
});

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
          widths: ['*', '30%'],
          body: [
            [
              {
                margin: [0, 0, 0, 0],
                text: 'Ficha de Inscripción',
                fontSize: 24,
                alignment: 'center',
                bold: true,
              },
              {
                // Image in the top right corner
                image: `data:image/png;base64,${imageBase64}`,
                width: 100, // Adjust width as needed
                alignment: 'right',
                margin: [0, 0, 0, 0], // Adjust margin as needed
              },
            ],
          ],
        },
      },
      {
        margin: [0, 30, 5, 0],
        layout: 'noBorders',
        table: {
          widths: ['*', '30%'],
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
        text: 'Primera DINO KIDS - Desarrollo Infantil Neuro Psicológico Orientado se se compromete a lo siguiente:',
        style: 'stylePagrafer',
      },
      {
        text: '1.- Brindar evaluaciones periódicas, para tratar dificultades de aprendizaje utilizando un método de capacitación 100% garantizado adecuado a cada caso.',
        style: 'stylePagrafer',
      },
      {
        text: '2.- El programa es anual, sin embargo el tiempo de duración de cada módulo es de 6 meses.',
        style: 'stylePagrafer',
      },
      {
        text: '3.- Al finalizar el programa se le otorgara un informe de avanze y/o resultados.',
        style: 'stylePagrafer',
      },
      {
        text: 'Segunda: Los datos del titular y del alumno son:',
        style: 'stylePagrafer',
      },
      {
        margin: [0, 20, 0, 0],
        text: 'Datos del tutor:',
      },
      {
        margin: [0, 30, 5, 0],
        layout: 'noBorders',
        table: {
          widths: ['*', '*'],
          body: [
            [
              generateTable(
                'Nombre del tutor',
                `${inscriptionEntity.student?.tutors![0].name} ${
                  inscriptionEntity.student?.tutors![0].lastName
                }`
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
        margin: [0, 30, 5, 0],
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
                'Celular de Ref',
                `${inscriptionEntity.student?.tutors![0].phone}`
              ),
            ],
          ],
        },
      },
      {
        margin: [0, 20, 0, 0],
        text: 'Datos del estudiante:',
      },
      {
        margin: [0, 30, 5, 0],
        layout: 'noBorders',
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            [
              generateTable(
                'Nombre del estudiante',
                `${inscriptionEntity.student?.name} ${inscriptionEntity.student?.lastName}`
              ),
              generateTable(
                'Edad',
                `${inscriptionEntity.student?.tutors![0].phone}`
              ),
              generateTable(
                'Fecha de nacimiento',
                `${format(
                  new Date(inscriptionEntity.student!.birthdate),
                  'dd-MMMM-yyyy',
                  { locale: esES }
                )}`
              ),
              generateTable('Sexo', `${inscriptionEntity.student!.gender}`),
            ],
          ],
        },
      },
      {
        margin: [0, 30, 5, 0],
        layout: 'noBorders',
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            [
              generateTable('Programa', `algo`),
              generateTable(
                'Inicio de sesión',
                `${format(new Date(), 'dd-MMMM-yyyy', { locale: esES })}`
              ),
              generateTable('Módulo', `1er módulo`),
              generateTable('Sesiones', ``),
            ],
          ],
        },
      },
      {
        margin: [0, 20, 0, 0],
        text: 'Método de pago:   Plan Mensual',
      },
      {
        margin: [0, 20, 0, 0],
        text: 'Los pagos se deben realizarse hasta el 5 de cada mes.',
      },
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: '____________________',
                style: 'styleCenter',
              },
            ],
            [{ text: 'Firma del tutor principal', style: 'styleCenter' }],
          ],
        },
        layout: 'noBorders',
      },
    ],
    styles: {
      stylePagrafer: {
        margin: [0, 0, 0, 0],
      },
      styleCenter: {
        alignment: 'center',
        fontSize: 12,
        margin: [0, 0, 0, 0],
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
