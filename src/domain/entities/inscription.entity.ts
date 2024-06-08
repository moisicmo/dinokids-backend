import { BranchEntity, StaffEntity, StudentEntity, SubjectEntity } from '..';

export class InscriptionEntity {
  constructor(
    public id: number,
    public total: number,
    public url: string,
    public createdAt: Date,
    public student?: StudentEntity,
    public staff?: StaffEntity,
    public subject?: SubjectEntity,
    public branch?: BranchEntity,
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const {
      id,
      total,
      url,
      createdAt,
      student,
      staff,
      subject,
      branch,
    } = object;
    const studentEntity = StudentEntity.fromObject(student);
    const staffEntity = StaffEntity.fromObject(staff);
    const subjectEntity = SubjectEntity.fromObject(subject);
    const branchEntity = BranchEntity.fromObject(branch);

    return new InscriptionEntity(
      id,
      total,
      url,
      createdAt,
      studentEntity,
      staffEntity,
      subjectEntity,
      branchEntity,
    );
  }
}
