export class ScheduleDto {
  private constructor(
    public readonly days: DayOfWeek[],
    public readonly start: Date,
    public readonly end: Date,
    public readonly roomId: number,
  ) {}

  static body(object: { [key: string]: any }): [string?, ScheduleDto?] {
    const { days, start, end,roomId } = object;

    if (!days) return ['El día es obligatorio'];
    if (!start) return ['La hora de inicio es obligatorio'];
    if (!end) return ['La hora fin es obligatorio'];
    if (!roomId) return ['El id de la sala es obligatorio'];

    return [undefined, new ScheduleDto(days, start, end,roomId)];
  }
}
export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}