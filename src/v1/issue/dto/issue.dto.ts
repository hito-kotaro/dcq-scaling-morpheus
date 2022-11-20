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

  @ApiProperty({ type: String })
  penalty_title: string;

  @ApiProperty({ type: String })
  penalty_description: string;

  @ApiProperty({ type: Number })
  point: number;

  @ApiProperty({ type: Date })
  penalty_updated_at: Date;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ type: Date })
  updated_at: Date;
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
  penalty_id: number;
}
