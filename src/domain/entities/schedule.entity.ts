import { DayOfWeek, TeacherEntity } from "..";

export class ScheduleEntity {
  constructor(
    public id: number,
    public days: DayOfWeek[],
    public start: Date,
    public end: Date,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, days, start, end } = object;
    return new ScheduleEntity(id, days, start, end);
  }
}