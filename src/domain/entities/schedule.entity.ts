import { AssignmentScheduleEntity, DayOfWeek, TeacherEntity } from "..";

export class ScheduleEntity {
  constructor(
    public id: number,
    public days: DayOfWeek[],
    public start: Date,
    public end: Date,
    public assignmentSchedules?: AssignmentScheduleEntity[]
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, days, start, end, assignmentSchedules } = object;
    const assignmentSchedulesEntity = assignmentSchedules ? assignmentSchedules.map((e:any)=>AssignmentScheduleEntity.fromObject(e)) : undefined;
    return new ScheduleEntity(id, days, start, end,assignmentSchedulesEntity);
  }
}