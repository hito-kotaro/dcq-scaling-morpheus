import { ApiProperty } from '@nestjs/swagger';

export class GetOneRoleResponse {
  @ApiProperty({ type: Number, description: 'ロールID' })
  readonly id: number;

  @ApiProperty({ type: String, description: 'ロール名' })
  readonly role_name: string;
}

export class GetAllRolesResponse {
  @ApiProperty({ type: GetOneRoleResponse, description: 'ロール一覧' })
  readonly roles: GetOneRoleResponse[];
}
