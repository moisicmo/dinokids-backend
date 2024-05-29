export class SubjectDto {

  private constructor(
    public readonly name: string,
    public readonly code: string,
    public readonly semester: number,
  ) {}


  static body( object: { [key: string]: any } ):[string?, SubjectDto?] {

    const { name, code, semester } = object;

    if ( !name ) return ['El nombre es obligatorio'];
    if ( !code) return ['El código es obligatorio'];
    if ( !semester) return ['El semestre es obligatorio'];

    return [undefined, new SubjectDto(name,code,semester)];

  }

}