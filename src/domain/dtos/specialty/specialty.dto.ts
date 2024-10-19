export class SpecialtyDto {

  private constructor(
    public readonly name: string,
    public readonly numberSessions: number,
    public readonly estimatedSessionCost: number,
  ) { }


  static body(object: { [key: string]: any }): [string?, SpecialtyDto?] {

    const { name, numberSessions, estimatedSessionCost } = object;

    if (!name) return ['El nombre es obligatorio'];
    if (!numberSessions) return ['El número de sesiones es necesario'];
    if (!estimatedSessionCost) return ['El costo por sesión estimado es necesario'];

    return [undefined, new SpecialtyDto(name, numberSessions, estimatedSessionCost)];
  }
}