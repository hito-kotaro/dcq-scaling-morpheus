import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Quests } from 'src/entity/quest.entity';
import { Users } from 'src/entity/user.entity';

export class RequestDataResponse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  applicant: string;

  @ApiProperty({ type: String })
  quest_title: string;

  @ApiProperty({ type: String })
  quest_description: string;

  @ApiProperty({ type: Number })
  reward: number;

  @ApiProperty({ type: String })
  status: string;

  @ApiProperty({ type: String })
  @IsOptional()
  authorizer?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  auth_comment?: string;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ type: Date })
  updated_at: Date;
}

export class AllRequestDataResponse {
  @ApiProperty({ type: RequestDataResponse })
  requests: RequestDataResponse[];

  @ApiProperty({ type: Number })
  total: number;
}

export class FindOneRequestResponse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Users })
  applicant: Users;

  @ApiProperty({ type: Quests })
  quest: Quests;
}

export class FindAllRequestResponse {
  @ApiProperty({ type: FindOneRequestResponse })
  readonly requests: FindOneRequestResponse[];

  @ApiProperty({ type: Number })
  readonly total: number;
}

export class CreateRequestRequest {
  @ApiProperty({ type: String })
  readonly title: string;

  @ApiProperty({ type: String })
  readonly description: string;

  @ApiProperty({ type: Number })
  readonly quest_id: number;

  // @ApiProperty({ type: Number })
  // readonly applicant_id: number;
}

export class UpdateRequestRequest {
  @ApiProperty({ type: String })
  auth_comment: string;

  @ApiProperty({ type: String })
  status: string;
}
