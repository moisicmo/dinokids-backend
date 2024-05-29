export class SeasonDto {

  private constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly start: Date,
    public readonly end: Date,
    public readonly enableState: boolean,
    public stages: number[],
  ) { }


  static body(object: { [key: string]: any }): [string?, SeasonDto?] {

    const { name, price, start, end, enableState, stages } = object;

    if (!name) return ['El nombre es obligatorio'];
    if (!price) return ['El precio es obligatorio'];
    if (!start) return ['La fecha de inicio es obligatoria'];
    if (!end) return ['La fecha fin es obligatoria'];
    if (stages.length == 0) return ['Debe ver almenos una etapa'];

    return [undefined, new SeasonDto(name, price, start, end, enableState, stages)];
  }
}