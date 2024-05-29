import { SubjectEntity, TeacherEntity } from "..";

export class ParallelEntity {
  constructor(
    public id: number,
    public name: string,
    public teacher?: TeacherEntity,
    public subject?: SubjectEntity,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, teacher, subject } = object;

    const teacherEntity = TeacherEntity.fromObject(teacher);
    const subjectEntity = SubjectEntity.fromObject(subject);

    return new ParallelEntity(id, name, teacherEntity, subjectEntity);
  }
}