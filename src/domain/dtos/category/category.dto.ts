export class CategoryDto {

  private constructor(
    public readonly name: string,
  ) {}


  static body( object: { [key: string]: any } ):[string?, CategoryDto?] {

    const { name } = object;

    if ( !name ) return ['El nombre es obligatorio'];

    return [undefined, new CategoryDto(name)];

  }

}