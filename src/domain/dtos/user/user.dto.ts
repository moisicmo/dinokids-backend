export class UserDto {
  constructor(
    public readonly dni: string,
    public readonly name: string,
    public readonly lastName: string,
    public readonly email: string,
  ) { }

  static body(object: { [key: string]: any }): [string?, UserDto?] {
    const { dni, name, lastName, email } = object;

    if (!dni) return ['El número de carnet es obligatorio'];
    if (!name) return ['El nombre es obligatorio'];
    if (!lastName) return ['El apellido es obligatorio'];
    if (!email) return ['El correo electrónico es obligatorio'];

    return [undefined, new UserDto(dni, name, lastName, email)];
  }
}