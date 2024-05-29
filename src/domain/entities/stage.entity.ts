import { RequirementEntity } from "..";

export class StageEntity {
  constructor(
    public id: number,
    public name: string,
    public start: Date,
    public end: Date,
    public weighing: number,
    public requirements?: RequirementEntity,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, start, end, weighing, requirements } = object;

    const requirementEntity = requirements ? requirements.map((e:RequirementEntity)=>RequirementEntity.fromObject(e)) : undefined;


    return new StageEntity(id, name, start, end, weighing, requirementEntity);
  }
}
