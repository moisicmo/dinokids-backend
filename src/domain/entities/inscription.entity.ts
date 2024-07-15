import { BranchEntity, StaffEntity, StudentEntity, SubjectEntity, PriceEntity } from '..';
import { TMonthlyfeeInput } from '../../schemas/monthlyFee.schema';

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
    public price?: PriceEntity,
    public monthlyFee?: any,
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
      price,
      monthlyFee,
    } = object;
    const studentEntity = StudentEntity.fromObject(student);
    const staffEntity = StaffEntity.fromObject(staff);
    const subjectEntity = SubjectEntity.fromObject(subject);
    const branchEntity = BranchEntity.fromObject(branch);
    const priceEntity = PriceEntity.fromObject(price);
    const monthlyFeeEntity = monthlyFee;
    

    return new InscriptionEntity(
      id,
      total,
      url,
      createdAt,
      studentEntity,
      staffEntity,
      subjectEntity,
      branchEntity,
      priceEntity,
      monthlyFee,
    );
  }
}
