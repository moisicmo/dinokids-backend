
export class RequirementEntity {
  constructor(
    public id: number,
    public name: string,
    public description: string,

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, description } = object;
    return new RequirementEntity(id, name, description);
  }
}
