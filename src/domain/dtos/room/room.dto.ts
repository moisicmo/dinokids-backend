export class RoomDto {

  private constructor(
    public readonly name: string,
    public readonly branchId: number,
  ) {}


  static body( object: { [key: string]: any } ):[string?, RoomDto?] {

    const { name,branchId } = object;

    if ( !name ) return ['El nombre es obligatorio'];
    if (!branchId) return ['El id de la sucursal es obligatorio'];

    return [undefined, new RoomDto(name,branchId)];

  }

}