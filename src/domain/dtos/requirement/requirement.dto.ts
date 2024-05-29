export class RequirementDto {

  private constructor(
    public readonly name: string,
    public readonly description: string,
  ) {}


  static body( object: { [key: string]: any } ):[string?, RequirementDto?] {

    const { name, description } = object;

    if ( !name ) return ['El nombre es obligatorio'];
    if ( !description ) return ['La descripción es obligatoria'];

    return [undefined, new RequirementDto(name,description)];

  }

}