import { ApiProperty } from '@nestjs/swagger';

export class IssueResponse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  authorizer: string;

  @ApiProperty({ type: Number })
  team_id: number;

  @ApiProperty({ type: String })
  team: string;

  @ApiProperty({ type: String })
  penalty_title: string;

  @ApiProperty({ type: String })
  penalty_description: string;
}

export class AllIssueResponse {
  @ApiProperty({ type: IssueResponse })
  issues: IssueResponse[];

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
