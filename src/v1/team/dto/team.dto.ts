import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Tenants } from 'src/entity/tenant.entity';

export class FindOneTeamResponse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  team_name: string;

  @ApiProperty({ type: Number })
  penalty: number;

  @ApiProperty({ type: Tenants })
  readonly tenant: Tenants;
}

export class FindAllTeamResponse {
  @ApiProperty({ type: FindOneTeamResponse })
  readonly teams: FindOneTeamResponse[];

  @ApiProperty({ type: Number })
  readonly total: number;
}

export class CreateTeamDto {
  @ApiProperty({ type: Number })
  readonly tenant_id: number;
  @ApiProperty({ type: String })
  readonly team_name: string;
}

export class UpdateTeamDto {
  @ApiProperty({ type: String })
  @IsOptional()
  readonly team_name?: string;
  @ApiProperty({ type: Number })
  @IsOptional()
  readonly penalty?: number;
}

export class TeamSuccessResponse {
  @ApiProperty({ type: Number })
  readonly id!: number;

  @ApiProperty({ type: String })
  readonly message: string;
}
