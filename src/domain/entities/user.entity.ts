import { StaffAuthEntity, StudentAuthEntity, TeacherAuthEntity } from '..';
import { CustomError } from '../responses/custom.error';

export class UserEntity {
  constructor(
    public id: number,
    public dni: string,
    public name: string,
    public lastName: string,
    public email: string,
    public emailValidated?: boolean,
    public password?: string,
    public codeValidation?: string,
    public image?: string,
    public phone?: string, // Asegúrate de incluir phone aquí
    public staffs?: StaffAuthEntity,
    public students?: StudentAuthEntity,
    public teachers?: TeacherAuthEntity,
  ) {}

  static fromObjectAuth(object: { [key: string]: any }) {
    const {
      id,
      dni,
      name,
      lastName,
      email,
      emailValidated,
      password,
      codeValidation,
      image,
      phone, // Incluye phone aquí
      staff,
      student,
      teacher,
    } = object;

    if (!id) throw CustomError.badRequest('Falta id');
    if (!dni) throw CustomError.badRequest('Falta el número de carnet');
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
      dni,
      name,
      lastName,
      email,
      emailValidated,
      password,
      codeValidation,
      image,
      phone, // Asegúrate de pasar phone aquí
      staffAuthEntity,
      studentAuthEntity,
      teacherAuthEntity,
    );
  }

  static fromObject(object: { [key: string]: any }) {
    const { id, dni, name, lastName, email, phone } = object; // Incluye phone aquí

    if (!id) throw CustomError.badRequest('Falta id');
    if (!dni) throw CustomError.badRequest('Falta el número de carnet');
    if (!name) throw CustomError.badRequest('Falta el nombre');
    if (!lastName) throw CustomError.badRequest('Falta el apellido');
    if (!email) throw CustomError.badRequest('Falta el correo');

    return new UserEntity(id, dni, name, lastName, email, undefined, undefined, undefined, undefined, phone); // Incluye phone aquí
  }
}
