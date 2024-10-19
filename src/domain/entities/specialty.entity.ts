import { RoomEntity } from "./room.entity";

export class SpecialtyEntity {
  constructor(
    public id: number,
    public name: string,
    public numberSessions: number,
    public estimatedSessionCost: number,
    public rooms?: RoomEntity[],

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, numberSessions, estimatedSessionCost, rooms } = object;
    const roomsEntity = rooms ? rooms.map((e:RoomEntity)=>RoomEntity.fromObject(e)) : undefined;
    return new SpecialtyEntity(id, name, numberSessions, estimatedSessionCost, roomsEntity);
  }
}
