const pdfMakeX = require('pdfmake');
import { format } from 'date-fns';
import esES from 'date-fns/locale/es';
import { TMonthlyfeeOutput } from '../../../schemas/monthlyFee.schema';
import { numberToString } from '../..';
import { TMonthlyFeePaymentOutput } from '../../../schemas/monthlyFeePayment';
import { invoiceOuputSchema, TInvoiceOuput } from '../../../schemas/invoice.schema';

export const generatePayInscriptionPdf = async ({monthleFee,monthlyFeePayment,invoice}:{monthleFee: TMonthlyfeeOutput,monthlyFeePayment:TMonthlyFeePaymentOutput, invoice:TInvoiceOuput
}) => {
 // console.log("pdfmonthyfee:",monthleFee)
  //console.log("pdfmonthlyFeePayment:",monthlyFeePayment)
  //console.log("pdfinvoice:",invoice)
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
              { text: `DINO KIDS ${invoice.issuerNIT}`, style: 'styleLeft' },
              {
                text: `FECHA:° ${format(invoice.issueDate, 'dd MMMM yyyy', {
                  locale: esES,
                })}`,
                style: 'styleRight',
              },
            ],
            [{
              text: `N Recibo:° ${invoice.invoiceNumber}`,
              style: 'styleLeft',
            },
            {
              text: `CODIGO:° ${invoice.controlCode}`,
              style: 'styleRight',
            },],
            [
              {
                text: 'Calle Batallon Colorados ',
                style: 'styleLeft',
                colSpan: 2,
              },
            ],
            [
              {
                text: 'www.dinokids.com.bo ',
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
        text: 'RECIBO OFICIAL',
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
              { text: 'Dinokids Recibe De:', style: 'styleLeft', bold: true },
              `${invoice.buyerName}`,
            ],
            [
              { text: 'NIT/DNI:', style: 'styleLeft', bold: true },
              `${invoice.buyerNIT}`,
            ],
            [
              { text: 'Inscripcion:', style: 'styleLeft', bold: true },
              `${monthleFee.totalInscription}`,
            ],
            [
              { text: 'Mensualidad:', style: 'styleLeft', bold: true },
              `${monthleFee.totalAmount}`,
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
                text: 'Descripción Programa',
                bold: true,
                style: 'styleLeft',
                margin: [1, 3, 1, 3],
              },
              {
                text: 'Saldo',
                bold: true,
                style: 'styleRight',
                margin: [1, 3, 1, 3],
              },
              {
                text: 'Precio Total',
                bold: true,
                style: 'styleRight',
                margin: [1, 3, 1, 3],
              },
            ],
            [
              { text: `1`, style: 'styleRight', margin: [1, 3, 1, 3] },
              {
                text: `${monthlyFeePayment.isInscription ? 'INSCRIPCIÓN' : 'MENSUALIDAD'}`,
                style: 'styleCenter',
                margin: [1, 3, 1, 3],
              },
              {
                text: `${monthlyFeePayment.isInscription ? '0' : monthleFee.amountPending}`,
                style: 'styleRight',
                margin: [1, 3, 1, 3],
              },
              {
                text: `${monthlyFeePayment.isInscription ? monthleFee.totalInscription : monthlyFeePayment.amount}`,
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
                  monthlyFeePayment.isInscription ? monthleFee.totalInscription : monthlyFeePayment.amount
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
                      `${monthlyFeePayment.isInscription ? monthleFee.totalInscription : monthlyFeePayment.amount}`,
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
