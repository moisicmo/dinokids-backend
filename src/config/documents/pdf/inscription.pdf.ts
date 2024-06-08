const pdfMakeX = require('pdfmake');
import { format } from 'date-fns';
import esES from 'date-fns/locale/es';

import { InscriptionEntity } from '../../../domain';
import { numberToString } from '../..';

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
  const docDefinition = {
    pageSize: 'LETTER',
    pageMargins: [40, 50, 40, 50],
    defaultStyle: {
      fontSize: 12,
    },
    content: [
      {
        margin: [0, 30, 0, 0],
        layout: 'noBorders',
        table: {
          widths: ['*', '*'],
          body: [
            [
              { text: 'DINO KIDS', style: 'styleLeft' },
              {
                text: `COMPROBANTE N° ${inscriptionEntity.id}`,
                style: 'styleRight',
              },
            ],
            [
              {
                text: 'SUCURSAL ',
                style: 'styleLeft',
                colSpan: 2,
              },
            ],
            // [{ text: 'CENTRO DE ESTUDIANTES', style: 'styleLeft', colSpan: 2 }],
          ],
        },
      },
      {
        margin: [0, 30, 0, 0],
        text: 'COMPROVANTE DE PAGO',
        fontSize: 24,
        alignment: 'center',
        bold: true,
      },
      {
        margin: [0, 30, 0, 0],
        layout: 'noBorders',
        table: {
          widths: ['auto', '*'],
          body: [
            [
              { text: 'Fecha:', style: 'styleLeft', bold: true },
              `${format(inscriptionEntity.createdAt, 'dd MMMM yyyy', {
                locale: esES,
              })}`,
            ],
            [
              { text: 'Estudiante:', style: 'styleLeft', bold: true },
              `${inscriptionEntity.student?.name} ${inscriptionEntity.student?.lastName}`,
            ],
            [
              { text: 'Código de estudiante:', style: 'styleLeft', bold: true },
              `${inscriptionEntity.student?.code}`,
            ],
            [
              { text: 'Emitido por:', style: 'styleLeft', bold: true },
              `${inscriptionEntity.staff?.name} ${inscriptionEntity.staff?.lastName}`,
            ],
          ],
        },
      },
      {
        margin: [0, 30, 0, 0],
        layout: {
          hLineWidth: function () {
            return 1;
          },
          vLineWidth: function () {
            return 0;
          },
        },
        table: {
          widths: ['8%', '*', '14%', '14%'],
          body: [
            [
              {
                text: 'CANT.',
                bold: true,
                style: 'styleRight',
                margin: [1, 3, 1, 3],
              },
              {
                text: 'DESCRIPCIÓN',
                bold: true,
                style: 'styleLeft',
                margin: [1, 3, 1, 3],
              },
              {
                text: 'PRECIO',
                bold: true,
                style: 'styleRight',
                margin: [1, 3, 1, 3],
              },
              {
                text: 'SUBTOTAL',
                bold: true,
                style: 'styleRight',
                margin: [1, 3, 1, 3],
              },
            ],
            [
              { text: `1`, style: 'styleRight', margin: [1, 3, 1, 3] },
              {
                text: `INSCRIPCIÓN`,
                style: 'styleCenter',
                margin: [1, 3, 1, 3],
              },
              {
                text: `${inscriptionEntity.total}`,
                style: 'styleRight',
                margin: [1, 3, 1, 3],
              },
              {
                text: `${inscriptionEntity.total}`,
                style: 'styleRight',
                margin: [1, 3, 1, 3],
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
                text: `Son: ${numberToString(
                  inscriptionEntity.total
                )} 00/100 Bolivianos`,
                style: 'styleLeft',
              },
              {
                layout: 'noBorders',
                table: {
                  widths: ['*', 'auto'],
                  body: [
                    [
                      { text: 'TOTAL A PAGAR:', style: 'styleRight' },
                      `${inscriptionEntity.total}`,
                    ],
                  ],
                },
              },
            ],
          ],
        },
      },
    ],
    styles: {
      styleCenter: {
        alignment: 'center',
      },
      styleLeft: {
        alignment: 'left',
      },
      styleRight: {
        alignment: 'right',
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
