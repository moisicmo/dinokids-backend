import { BranchEntity, SpecialtyEntity, TeacherEntity } from '..';

export class RoomEntity {
  constructor(
    public id: number,
    public name: string,
    public capacity: number,
    public rangeYears: number[],
    public branch?: BranchEntity,
    public teacher?: TeacherEntity,
    public specialty?: SpecialtyEntity,
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, name, capacity, rangeYears, branch, teacher, specialty } = object;
    const branchEntity = BranchEntity.fromObject(branch);
    const teacherEntity = TeacherEntity.fromObject(teacher) ?? undefined;
    const specialtyEntity = SpecialtyEntity.fromObject(specialty) ?? undefined;
    return new RoomEntity(id, name, capacity, rangeYears, branchEntity, teacherEntity,specialtyEntity);
  }
}
