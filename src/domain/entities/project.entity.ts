import {
  CategoryEntity,
  ParallelEntity,
  SeasonEntity,
  StaffEntity,
  StudentEntity,
  TypeProjectEntity,
} from '..';

export class ProjectEntity {
  constructor(
    public id: number,
    public title: string,
    public code: string,
    public staff:StaffEntity,
    public category: CategoryEntity,
    public typeProject: TypeProjectEntity,
    public season: SeasonEntity,
    public students: StudentEntity[],
    public parallels: ParallelEntity[]
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const {
      id,
      title,
      code,
      staff,
      category,
      typeProject,
      season,
      students,
      parallels,
    } = object;

    const staffEntity = StaffEntity.fromObject(staff);
    const categoryEntity = CategoryEntity.fromObject(category);
    const typeProjectEntity = TypeProjectEntity.fromObject(typeProject);
    const seasonEntity = SeasonEntity.fromObject(season);
    const studentEntity = students.map((e: StudentEntity) => StudentEntity.fromObject(e));
    const parallelEntity =  parallels.map((e: ParallelEntity) => ParallelEntity.fromObject(e));

    return new ProjectEntity(
      id,
      title,
      code,
      staffEntity,
      categoryEntity,
      typeProjectEntity,
      seasonEntity,
      studentEntity,
      parallelEntity
    );
  }
}
