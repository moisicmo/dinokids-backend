import { CategoryEntity } from "./category.entity";

export class SubjectEntity {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public category: CategoryEntity,

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, code, category } = object;
    const categoryEntity = category ?? undefined;
    return new SubjectEntity(id, name, code, categoryEntity);
  }
}
