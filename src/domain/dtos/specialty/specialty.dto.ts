export class SpecialtyDto {

  private constructor(
    public readonly name: string,
  ) { }


  static body(object: { [key: string]: any }): [string?, SpecialtyDto?] {

    const { name } = object;

    if (!name) return ['El nombre es obligatorio'];

    return [undefined, new SpecialtyDto(name)];
  }
}