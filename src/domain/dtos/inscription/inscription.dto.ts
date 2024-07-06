export class InscriptionDto {

  private constructor(
    public readonly studentId: number,
    public readonly subjectId: number,
    public readonly branchId: number,
    public readonly priceId: number,
  ) { }


  static body(object: { [key: string]: any }): [string?, InscriptionDto?] {

    const {studentId,subjectId,branchId,priceId} = object;

    if (!studentId) return ['El id del estudiante es obligatorio'];
    if (!subjectId) return ['El id de la materia es obligatorio'];
    if (!branchId) return ['El id de la sucursal es obligatorio'];
    if (!priceId) return ['El id del precio es obligatorio'];

    return [undefined, new InscriptionDto(studentId,subjectId,branchId,priceId)];
  }
}