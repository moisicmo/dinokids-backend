import { AssignmentScheduleEntity, InscriptionEntity, RoomEntity } from '..';

export class AssignmentRoomEntity {
  constructor(
    public id: number,
    public room?: RoomEntity,
    public assignmentSchedule?: AssignmentScheduleEntity,
    public inscription?: InscriptionEntity,
  ) { }

  static fromObject(object: { [key: string]: any }) {
    const { id, rooms, assignmentSchedules, inscriptions } = object;
    const roomEntity = rooms? RoomEntity.fromObject(rooms) : undefined;
    const assignmentScheduleEntity = assignmentSchedules ? assignmentSchedules.map((e: any) => AssignmentScheduleEntity.fromObject(e)) : undefined;
    const inscriptionSchedule = inscriptions? InscriptionEntity.fromObject(inscriptions):undefined;
    return new AssignmentRoomEntity(id, roomEntity, assignmentScheduleEntity,inscriptionSchedule);
  }
}
