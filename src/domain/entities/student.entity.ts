import { UserEntity } from "..";

export class StudentAuthEntity {
  constructor(
    public id: number,
    public code: string,
  ) {}
  static fromObject(object: { [key: string]: any }) {
    const { id, code } = object;
    return new StudentAuthEntity(id, code);
  }
}

export class StudentEntity extends UserEntity {
  public readonly code: string;

  constructor(id: number, code: string, user: UserEntity) {
    super(user.id, user.dni, user.name, user.lastName, user.email);
    this.id = id;
    this.code = code;
  }
  static fromObject(object: { [key: string]: any }) {
    const { id, code, user } = object;

    const userEntity = UserEntity.fromObject(user);

    return new StudentEntity(id, code, userEntity);
  }
}
