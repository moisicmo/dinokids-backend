export class TypeProjectDto {

  private constructor(
    public readonly name: string,
  ) {}


  static body( object: { [key: string]: any } ):[string?, TypeProjectDto?] {

    const { name } = object;

    if ( !name ) return ['El nombre es obligatorio'];

    return [undefined, new TypeProjectDto(name)];

  }

}