export class InscriptionDto {

  private constructor(
    public readonly studentId: number,
    public rooms: number[],
    public inscription: number,
    public month: number,

  ) { }


  static body(object: { [key: string]: any }): [string?, InscriptionDto?] {

    const { studentId, rooms, inscription, month } = object;

    if (!studentId) return ['El id del estudiante es obligatorio'];
    if (rooms.length == 0) return ['Debe ver almenos un aula asignada'];
    if (!inscription) return ['debe ver un monto de inscripción acordado'];
    if (!month) return ['debe ver un monto de mensualidad acordado'];

    return [undefined, new InscriptionDto(studentId, rooms, inscription, month)];
  }
}