import { ModuleEntity } from './module.entity';
import { RoomEntity } from './room.entity';
import { TeacherEntity } from './teacher.entity';

export class ClasseEntity {
  constructor(
    public id: number,
    public name: string,
    public start: Date,
    public end: Date,
    public room: RoomEntity,
    public teacher: TeacherEntity,
    public module: ModuleEntity,

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, start, end, room, teacher, module } = object;
    const roomEntity = room ?? undefined;
    const teacherEntity = TeacherEntity.fromObject(teacher) ?? undefined;
    const moduleEntity = module ?? undefined;
    return new ClasseEntity(id, name, start, end, roomEntity, teacherEntity, moduleEntity);
  }
}
