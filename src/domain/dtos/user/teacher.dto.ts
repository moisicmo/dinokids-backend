import { UserDto } from "./user.dto";

export class TeacherDto extends UserDto {
  public readonly ci: string;

  constructor(
    ci: string,
    userDto: UserDto
  ) {
    super(userDto.name, userDto.lastName, userDto.email);
    this.ci = ci;
  }

  static body(object: { [key: string]: any }): [string?, TeacherDto?] {
    const { ci, ...userData } = object;

    if (!ci) return ['La cédula de identidad es obligatorio'];

    const [error, userDto] = UserDto.body(userData);
    if (error) return [error];

    return [undefined, new TeacherDto(ci, userDto!)];
  }
}
