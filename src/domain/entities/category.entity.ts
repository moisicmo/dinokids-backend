
export class CategoryEntity {
  constructor(
    public id: number,
    public name: string,

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name } = object;
    return new CategoryEntity(id, name);
  }
}
