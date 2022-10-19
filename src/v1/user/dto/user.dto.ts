import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Roles } from 'src/entity/role.entity';
import { Teams } from 'src/entity/team.entity';
import { Tenants } from 'src/entity/tenant.entity';

export class FindOneUserResponse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Roles })
  role: Roles;

  @ApiProperty({ type: Teams })
  team: Teams;

  @ApiProperty({ type: Tenants })
  readonly tenant: Tenants;

  @ApiProperty({ type: Number })
  point: number;
}

export class UserSuccessResponse {
  @ApiProperty({ type: Number, description: 'ユーザID' })
  readonly id: number;

  @ApiProperty({ type: String, description: 'メッセージ' })
  readonly message: string;
}

export class CreateUserRequest {
  @ApiProperty({ type: Number })
  readonly tenant_id: number;

  @ApiProperty({ type: Number })
  readonly role_id: number;

  @ApiProperty({ type: Number })
  readonly team_id: number;

  @ApiProperty({ type: String })
  readonly name: string;

  @ApiProperty({ type: String })
  readonly password: string;

  @ApiProperty({ type: Number })
  readonly point: number;
}

export class UpdateUserRequest {
  @ApiProperty({ type: String })
  @IsOptional()
  readonly name: string;

  @IsOptional()
  @ApiProperty({ type: Number })
  readonly role_id: number;

  @IsOptional()
  @ApiProperty({ type: Number })
  readonly team_id: number;

  @IsOptional()
  @ApiProperty({ type: Number })
  readonly add_point: number;
}
