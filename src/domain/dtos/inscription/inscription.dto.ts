import { BranchEntity, RoomEntity, StudentEntity } from "../..";

export class InscriptionDto {

  private constructor(
    public readonly student: StudentEntity,
    public readonly branch: BranchEntity,
    public readonly rooms: RoomEntity[],


    public inscription: number,
    public month: number,

  ) { }


  static body(object: { [key: string]: any }): [string?, InscriptionDto?] {

    const { student, branch, rooms, inscription, month } = object;

    if (!student) return ['El estudiante es obligatorio'];
    if (!branch) return ['La sucursal es obligatorio'];
    if (!rooms) return ['Las aulas son obligatorias'];
    if (rooms.length == 0) return ['Debe ver almenos un aula asignada'];
    if (!inscription) return ['debe ver un monto de inscripción acordado'];
    if (!month) return ['debe ver un monto de mensualidad acordado'];

    return [undefined, new InscriptionDto(student,branch, rooms, inscription, month)];
  }
}