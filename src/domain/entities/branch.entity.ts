
export class BranchEntity {
  constructor(
    public id: number,
    public name: string,
    public address: string,
    public phone: string,
    public state: boolean,

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, address, phone, state } = object;
    return new BranchEntity(id, name, address, phone, state);
  }
}
