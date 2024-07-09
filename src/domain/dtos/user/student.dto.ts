import { UserDto } from "./user.dto";

export class StudentDto extends UserDto {

  constructor(
    userDto: UserDto
  ) {
    super(userDto.dni, userDto.name, userDto.lastName, userDto.email);
  }

  static body(object: { [key: string]: any }): [string?, StudentDto?] {
    const { ...userData } = object;

    const [error, userDto] = UserDto.body(userData);
    if (error) return [error];

    return [undefined, new StudentDto(userDto!)];
  }
}
