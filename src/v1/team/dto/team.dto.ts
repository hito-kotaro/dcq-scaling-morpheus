import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FindOneTeamResponse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Number })
  member: number;

  @ApiProperty({ type: Number })
  point: number;

  @ApiProperty({ type: Number })
  penalty: number;

  @ApiProperty({ type: Number })
  readonly tenant_id: number;

  // @ApiProperty({ type: Tenants })
  // readonly tenant: Tenants;
}

export class FindAllTeamResponse {
  @ApiProperty({ type: FindOneTeamResponse })
  readonly teams: FindOneTeamResponse[];

  @ApiProperty({ type: Number })
  readonly total: number;
}

export class CreateTeamRequest {
  @ApiProperty({ type: Number })
  readonly tenant_id: number;
  @ApiProperty({ type: String })
  readonly name: string;
}

export class UpdateTeamRequest {
  @ApiProperty({ type: String })
  @IsOptional()
  readonly name?: string;
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
