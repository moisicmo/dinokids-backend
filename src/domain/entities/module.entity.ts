import { SubjectEntity } from "./subject.entity";

export class ModuleEntity {
  constructor(
    public id: number,
    public name: string,
    public subject: SubjectEntity,

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, subject } = object;
    const subjectEntity = subject ?? undefined;
    return new ModuleEntity(id, name, subjectEntity);
  }
}
