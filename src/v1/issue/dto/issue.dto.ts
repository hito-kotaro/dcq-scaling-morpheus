import { ApiProperty } from '@nestjs/swagger';
import { Penalties } from 'src/entity/penalty.entity';
import { Teams } from 'src/entity/team.entity';
import { Users } from 'src/entity/user.entity';

export class FindOneIssueResonse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Users })
  authorizer: Users;

  @ApiProperty({ type: Teams })
  team: Teams;

  @ApiProperty({ type: Penalties })
  penalty: Penalties;
}

export class FindAllIssueResponse {
  @ApiProperty({ type: FindOneIssueResonse })
  issues: FindOneIssueResonse[];

  @ApiProperty({ type: Number })
  total: number;
}

export class CreateIssueRequest {
  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  tenant_id: number;

  @ApiProperty({ type: Number })
  authorizer_id: number;

  @ApiProperty({ type: Number })
  team_id: number;

  @ApiProperty({ type: Number })
  penalty_id: number;
}

export class DeleteIssueRequest {
  @ApiProperty({ type: Number })
  id: number;
}

export class IssueSuccessResponse {
  @ApiProperty({ type: Number, description: 'ペナルティ付与ID' })
  readonly id: number;

  @ApiProperty({ type: String, description: 'メッセージ' })
  readonly message: string;
}
