export class InscriptionDto {

  private constructor(
    public readonly amountDelivered: number,
    public readonly studentId: number,
  ) { }


  static body(object: { [key: string]: any }): [string?, InscriptionDto?] {

    const {amountDelivered, studentId } = object;

    if (!amountDelivered) return ['El monto entregado es obligatorio'];
    if (!studentId) return ['El id del estudiante es obligatorio'];

    return [undefined, new InscriptionDto(amountDelivered, studentId)];
  }
}