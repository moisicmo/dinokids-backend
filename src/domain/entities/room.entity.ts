import { BranchEntity } from "..";

export class RoomEntity {
  constructor(
    public id: number,
    public name: string,
    public branch?: BranchEntity,

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, branch } = object;
    const branchEntity = BranchEntity.fromObject(branch);
    return new RoomEntity(id, name, branchEntity);
  }
}