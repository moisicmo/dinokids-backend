
export class PriceEntity {
  constructor(
    public id: number,
    public classesId: number,
    public inscription: string,
    public month: string,
    public state: boolean,

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, classesId, inscription, month, state } = object;
    return new PriceEntity(id, classesId, inscription, month, state);
  }
}
