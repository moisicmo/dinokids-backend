import { ProjectEntity } from '../../../domain';
import ExcelJS from 'exceljs';

export const projectFollowingXlsx = async (
  projectEntity: ProjectEntity
): Promise<Uint8Array> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Formulario');
  worksheet.mergeCells('A1:B1');
  worksheet.mergeCells('A2:B2');
  worksheet.mergeCells('A3:B3');
  worksheet.mergeCells('G1:H1');
  worksheet.getCell('G1').value = 'UNIFRANZ';
  worksheet.mergeCells('G2:H2');
  worksheet.getCell('G2').value = 'FACULTAD DE INGENIERÍA';
  worksheet.mergeCells('G3:H3');
  worksheet.getCell('G3').value = 'INGENIERÍA DE SISTEMAS';
  worksheet.mergeCells('A4:H4');
  worksheet.getCell('A4').value = 'CONTROL Y SEGUIMIENTO DE PROYECTOS';
  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const uint8Array = new Uint8Array(buffer);
    return uint8Array;
  } catch (error) {
    console.log('Error al generar el archivo Excel: ' + error);
    throw new Error('Error al generar el archivo Excel');
  }
};
