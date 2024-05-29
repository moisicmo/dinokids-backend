export class StageDto {

  private constructor(
    public readonly name: string,
    public readonly start: Date,
    public readonly end: Date,
    public readonly weighing: number,
    public requirements: number[],
  ) { }


  static body(object: { [key: string]: any }): [string?, StageDto?] {

    const { name, start, end, weighing, requirements } = object;

    if (!name) return ['El nombre es obligatorio'];
    if (!start) return ['La fecha de inicio es obligatoria'];
    if (!end) return ['La fecha fin es obligatoria'];
    if (!weighing) return ['El peso para la etapa es obligatorio'];
    if (requirements.length == 0) return ['Debe ver almenos un requisito'];

    return [undefined, new StageDto(name, start, end, weighing, requirements)];
  }
}