
export class SubjectEntity {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public semester: number,

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, code,semester } = object;
    return new SubjectEntity(id, name, code, semester);
  }
}
