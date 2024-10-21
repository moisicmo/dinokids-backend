import { AssignmentRoomEntity, DayOfWeek, ScheduleEntity } from '..';

export class AssignmentScheduleEntity {
  constructor(
    public id: number,
    public day: DayOfWeek,
    public schedule?: ScheduleEntity,
    public assignmentRoomEntity?: AssignmentRoomEntity,
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, day, schedules, assignmentRooms } = object;
    const scheduleEntity = schedules? ScheduleEntity.fromObject(schedules) : undefined;
    const assignmentRoomsEntity = assignmentRooms? AssignmentRoomEntity.fromObject(assignmentRooms) : undefined;
    return new AssignmentScheduleEntity(id,day,scheduleEntity,assignmentRoomsEntity);
  }
}
