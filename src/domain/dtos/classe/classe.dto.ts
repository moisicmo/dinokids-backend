export class ClasseDto {
  private constructor(
    public readonly roomId: number,
    public readonly teacherId: number,
    public readonly moduleId: number,
    public readonly name: string,
    public readonly start: Date,
    public readonly end: Date,
    public readonly inscription: number,
    public readonly month: number,
  ) {}

  static body(object: { [key: string]: any }): [string?, ClasseDto?] {
    const { roomId, teacherId, moduleId, name, start, end, inscription, month } = object;

    if (!roomId) return ['El id de la sala es obligatoria'];
    if (!teacherId) return ['El id del profesor es obligatoria'];
    if (!moduleId) return ['El id del módulo es obligatoria'];
    if (!name) return ['El nombre es obligatorio'];
    if (!start) return ['La fecha hora de inicio es obligatorio'];
    if (!end) return ['La fecha hora fin es obligatorio'];
    if (!inscription) return ['El precio de inscripción es obligatorio'];
    if (!month) return ['El precio de mensualidad es obligatorio'];

    return [
      undefined,
      new ClasseDto(roomId, teacherId, moduleId, name, start, end, inscription, month),
    ];
  }
}
