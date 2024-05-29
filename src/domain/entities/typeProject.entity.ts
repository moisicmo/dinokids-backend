
export class TypeProjectEntity {
  constructor(
    public id: number,
    public name: string,

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name } = object;
    return new TypeProjectEntity(id, name);
  }
}
