import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Penalties } from 'src/entity/penalty.entity';
import { Teams } from 'src/entity/team.entity';
import { Users } from 'src/entity/user.entity';

export class FindOneIssueResonse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  comment: string;

  @ApiProperty({ type: Users })
  authorizer: Users;

  @ApiProperty({ type: Teams })
  team: Teams;

  @ApiProperty({ type: Penalties })
  penalty: Penalties;
}

export class FindAllRequestResponse {
  @ApiProperty({ type: FindOneIssueResonse })
  issues: FindOneIssueResonse[];
}

export class CreateIssueDto {
  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  comment: string;

  @ApiProperty({ type: Number })
  authorizer_id: number;

  @ApiProperty({ type: Number })
  team_id: number;

  @ApiProperty({ type: Number })
  penalty_id: number;
}

export class UpdateIssueDto {
  @ApiProperty({ type: String })
  @IsOptional()
  title: string;

  @ApiProperty({ type: String })
  @IsOptional()
  comment: string;
}

export class DeleteIssueDto {
  @ApiProperty({ type: Number })
  id: number;
}
