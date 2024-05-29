import { StaffAuthEntity, StudentAuthEntity, StudentEntity, TeacherAuthEntity, TeacherEntity } from '..';
import { CustomError } from '../responses/custom.error';

export class UserEntity {
  constructor(
    public id: number,
    public name: string,
    public lastName: string,
    public email: string,
    public emailValidated?: boolean,
    public password?: string,
    public codeValidation?: string,
    public image?: string,
    public staffs?: StaffAuthEntity,
    public students?: StudentAuthEntity,
    public teachers?: TeacherAuthEntity,
  ) {}

  static fromObjectAuth(object: { [key: string]: any }) {
    const {
      id,
      name,
      lastName,
      email,
      emailValidated,
      password,
      codeValidation,
      image,
      staff,
      student,
      teacher,
    } = object;

    if (!id) throw CustomError.badRequest('Falta id');
    if (!name) throw CustomError.badRequest('Falta el nombre');
    if (!lastName) throw CustomError.badRequest('Falta el apellido');
    if (!email) throw CustomError.badRequest('Falta el correo');
    if (!emailValidated)
    throw CustomError.badRequest('Falta la validación del correo');
  if (!password) throw CustomError.badRequest('Falta la contraseña');
  
  const staffAuthEntity = staff
      ? StaffAuthEntity.fromObject(staff)
      : undefined;
    
    const studentAuthEntity = student
    ? StudentAuthEntity.fromObject(student)
    : undefined;

    const teacherAuthEntity = teacher
    ? TeacherAuthEntity.fromObject(teacher)
    : undefined;
    return new UserEntity(
      id,
      name,
      lastName,
      email,
      emailValidated,
      password,
      codeValidation,
      image,
      staffAuthEntity,
      studentAuthEntity,
      teacherAuthEntity,
    );
  }

  static fromObject(object: { [key: string]: any }) {
    const { id, name,lastName, email } = object;

    if (!id) throw CustomError.badRequest('Falta id');
    if (!name) throw CustomError.badRequest('Falta el nombre');
    if (!lastName) throw CustomError.badRequest('Falta el apellido');
    if (!email) throw CustomError.badRequest('Falta el correo');

    return new UserEntity(id, name,lastName, email);
  }
}
