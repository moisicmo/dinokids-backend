export class ProjectDto {
  private constructor(
    public readonly title: string,
    public readonly categoryId: number,
    public readonly typeProjectId: number,
    public readonly students: number[],
    public readonly parallels: number[]
  ) {}

  static body(object: { [key: string]: any }): [string?, ProjectDto?] {
    const { title, categoryId, typeProjectId, students, parallels } = object;

    if (!title) return ['El titulo es obligatorio'];
    if (!categoryId) return ['El id del la categoria es obligatoria'];
    if (!typeProjectId) return ['El id del tipo de proyecto es obligatoria'];
    if (!students) return ['Es necesario incluir a los estudiantes'];
    if (students.length == 0) return ['Debe ver almenos un estudiante'];
    if (!parallels) return ['Es necesario incluir el paralelo'];
    if (parallels.length == 0) return ['Debe ver almenos un paralelo'];

    return [
      undefined,
      new ProjectDto(title, categoryId, typeProjectId, students, parallels),
    ];
  }
}
