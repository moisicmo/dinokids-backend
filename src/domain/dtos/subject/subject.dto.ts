export class SubjectDto {

  private constructor(
    public readonly categoryId: number,
    public readonly name: string,
    public readonly code: string,
  ) { }


  static body(object: { [key: string]: any }): [string?, SubjectDto?] {

    const { categoryId, name, code } = object;

    if (!categoryId) return ['El id de la categoria es obligatoria'];
    if (!name) return ['El nombre es obligatorio'];
    if (!code) return ['El código es obligatorio'];

    return [undefined, new SubjectDto(categoryId, name, code)];
  }
}