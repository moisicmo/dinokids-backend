export class BranchDto {

  private constructor(
    public readonly name: string,
    public readonly address: string,
    public readonly phone: string,
  ) { }


  static body(object: { [key: string]: any }): [string?, BranchDto?] {

    const { name, address, phone } = object;

    if (!name) return ['El nombre es obligatorio'];
    if (!address) return ['La dirección es obligatorio'];
    if (!phone) return ['El teléfono es obligatorio'];

    return [undefined, new BranchDto(name, address, phone)];

  }

}