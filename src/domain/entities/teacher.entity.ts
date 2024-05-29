import { UserEntity } from "..";

export class TeacherAuthEntity {
  constructor(
    public id: number,
    public ci: string,
  ) {}
  static fromObject(object: { [key: string]: any }) {
    const { id, ci } = object;
    return new TeacherAuthEntity(id, ci);
  }
}

export class TeacherEntity extends UserEntity {
  public readonly ci: string;

  constructor(id: number, ci: string, user: UserEntity) {
    super(user.id, user.name, user.lastName, user.email);
    this.id = id;
    this.ci = ci;
  }
  static fromObject(object: { [key: string]: any }) {
    const { id, ci, user } = object;

    const userEntity = UserEntity.fromObject(user);

    return new TeacherEntity(id, ci, userEntity);
  }
}