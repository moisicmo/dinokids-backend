import { StaffEntity, StudentEntity, PriceEntity, AssignmentRoomEntity } from '..';

export class InscriptionEntity {
  constructor(
    public id: number,
    public total: number,
    public url: string,
    public createdAt: Date,
    public student?: StudentEntity,
    public staff?: StaffEntity,
    public price?: PriceEntity,
    public monthlyFee?: any,
    public assignmentRooms?: AssignmentRoomEntity[],
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const {
      id,
      total,
      url,
      createdAt,
      student,
      staff,
      price,
      monthlyFee,
      assignmentRooms,
    } = object;
    const studentEntity = StudentEntity.fromObject(student);
    const staffEntity = staff? StaffEntity.fromObject(staff) : undefined;
    const priceEntity = price? PriceEntity.fromObject(price) : undefined;
    const monthlyFeeEntity = monthlyFee;
    const assignmentRoomEntity = assignmentRooms ? assignmentRooms.map((e:any)=>AssignmentRoomEntity.fromObject(e)) : undefined;

    return new InscriptionEntity(
      id,
      total,
      url,
      createdAt,
      studentEntity,
      staffEntity,
      priceEntity,
      monthlyFee,
      assignmentRoomEntity,
    );
  }
}
