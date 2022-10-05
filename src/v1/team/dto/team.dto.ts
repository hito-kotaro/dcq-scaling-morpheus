import { ApiProperty } from '@nestjs/swagger';
import { Tenants } from 'src/entity/tenant.entity';

export class FindOneTeamResponse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  readonly name: string;

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
  @ApiProperty({ type: String })
  readonly name: string;
  @ApiProperty({ type: Tenants })
  tenant: Tenants;
}

export class TeamSuccessResponse {
  @ApiProperty({ type: Number })
  readonly teamId!: number;

  @ApiProperty({ type: String })
  readonly message: string;
}
