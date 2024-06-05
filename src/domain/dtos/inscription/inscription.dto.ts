export class InscriptionDto {

  private constructor(
    public readonly studentId: number,
    public readonly subjectId: number,
    public readonly total: number,
  ) { }


  static body(object: { [key: string]: any }): [string?, InscriptionDto?] {

    const {studentId,subjectId,total} = object;

    if (!studentId) return ['El id del estudiante es obligatorio'];
    if (!subjectId) return ['El id de la materia es obligatorio'];

    return [undefined, new InscriptionDto(studentId,subjectId,total)];
  }
}