export class ModuleDto {

  private constructor(
    public readonly subjectId: number,
    public readonly name: string,
  ) { }


  static body(object: { [key: string]: any }): [string?, ModuleDto?] {

    const { subjectId, name } = object;

    if (!subjectId) return ['El id de la materia es obligatoria'];
    if (!name) return ['El nombre es obligatorio'];

    return [undefined, new ModuleDto(subjectId, name)];
  }
}