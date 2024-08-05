import { DayOfWeek, TeacherEntity } from "..";

export class ScheduleEntity {
  constructor(
    public id: number,
    public day: DayOfWeek,
    public start: Date,
    public end: Date,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, day, start, end } = object;
    return new ScheduleEntity(id, day, start, end);
  }
}