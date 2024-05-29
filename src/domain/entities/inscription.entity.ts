import { SeasonEntity, StaffEntity, StudentEntity } from '..';

export class InscriptionEntity {
  constructor(
    public id: number,
    public total: number,
    public amountDelivered: number,
    public returnedAmount: number,
    public url: string,
    public createdAt: Date,
    public student?: StudentEntity,
    public staff?: StaffEntity,
    public season?: SeasonEntity
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const {
      id,
      total,
      amountDelivered,
      returnedAmount,
      url,
      createdAt,
      student,
      staff,
      season,
    } = object;
    const studentEntity = StudentEntity.fromObject(student);
    const staffEntity = StaffEntity.fromObject(staff);
    const seasonEntity = SeasonEntity.fromObject(season);

    return new InscriptionEntity(
      id,
      total,
      amountDelivered,
      returnedAmount,
      url,
      createdAt,
      studentEntity,
      staffEntity,
      seasonEntity
    );
  }
}
