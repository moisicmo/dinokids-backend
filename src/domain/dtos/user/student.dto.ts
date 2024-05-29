import { UserDto } from "./user.dto";

export class StudentDto extends UserDto {
  public readonly code: string;

  constructor(
    code: string,
    userDto: UserDto
  ) {
    super(userDto.name, userDto.lastName, userDto.email);
    this.code = code;
  }

  static body(object: { [key: string]: any }): [string?, StudentDto?] {
    const { code, ...userData } = object;

    if (!code) return ['El código de estudiante es obligatorio'];

    const [error, userDto] = UserDto.body(userData);
    if (error) return [error];

    return [undefined, new StudentDto(code, userDto!)];
  }
}
