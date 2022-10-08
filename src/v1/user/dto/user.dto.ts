import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'src/entity/role.entity';
import { Tenants } from 'src/entity/tenant.entity';

export class FindOneUserResponse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  readonly user_name: string;

  @ApiProperty({ type: Roles })
  readonly role: Roles;

  @ApiProperty({ type: Tenants })
  readonly tenant: Tenants;

  @ApiProperty({ type: Number })
  readonly point: number;
}

export class UserSuccessResponse {
  @ApiProperty({ type: Number, description: 'ユーザID' })
  readonly id: number;

  @ApiProperty({ type: String, description: 'メッセージ' })
  readonly message: string;
}

export class CreateUserDto {
  @ApiProperty({ type: Number })
  readonly tenant_id: number;
  @ApiProperty({ type: Number })
  readonly role_id: number;
  @ApiProperty({ type: Number })
  readonly team_id: number;
  @ApiProperty({ type: String })
  readonly user_name: string;
  @ApiProperty({ type: String })
  readonly password: string;
}
