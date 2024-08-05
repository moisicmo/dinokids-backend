export class RoomDto {
  private constructor(
    public readonly name: string,
    public readonly branchId: number,
    public readonly teacherId: number,
    public readonly specialtyId: number,
    public readonly capacity: number,
    public readonly rangeYears: number[],
  ) {}

  static body(object: { [key: string]: any }): [string?, RoomDto?] {
    const { name, branchId, teacherId, specialtyId, capacity, rangeYears } =
      object;

    if (!name) return ['El nombre es obligatorio'];
    if (!branchId) return ['El id de la sucursal es obligatorio'];
    if (!teacherId) return ['El id del docente es obligatorio'];
    if (!specialtyId) return ['El id de la especialidad es obligatorio'];
    if (!capacity) return ['La capacidad de niños es obligatorio'];
    if (!rangeYears) return ['El rango de edad es obligatorio'];

    return [
      undefined,
      new RoomDto(name, branchId, teacherId, specialtyId, capacity, rangeYears),
    ];
  }
}
