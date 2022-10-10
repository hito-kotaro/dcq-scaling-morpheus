import { ApiProperty } from '@nestjs/swagger';
import { Quests } from 'src/entity/quest.entity';
import { Users } from 'src/entity/user.entity';

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

export class CreateRequestDto {
  @ApiProperty({ type: String })
  readonly title: string;

  @ApiProperty({ type: String })
  readonly description: string;

  @ApiProperty({ type: Number })
  readonly quest_id: number;

  @ApiProperty({ type: Number })
  readonly applicant_id: number;
}
