import { StaffEntity, StudentEntity, PriceEntity, RoomEntity } from '..';
import { TMonthlyfeeInput } from '../../schemas/monthlyFee.schema';

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
    public rooms?: RoomEntity[],
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
      rooms,
    } = object;
    const studentEntity = StudentEntity.fromObject(student);
    const staffEntity = StaffEntity.fromObject(staff);
    const priceEntity = PriceEntity.fromObject(price);
    const monthlyFeeEntity = monthlyFee;
    
    const roomsEntity = rooms ? rooms.map((e:RoomEntity)=>RoomEntity.fromObject(e)) : undefined;

    return new InscriptionEntity(
      id,
      total,
      url,
      createdAt,
      studentEntity,
      staffEntity,
      priceEntity,
      monthlyFee,
      roomsEntity,
    );
  }
}
