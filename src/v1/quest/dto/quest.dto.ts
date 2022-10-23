import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class QuestResponse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  @IsOptional()
  description: string;

  @ApiProperty({ type: String })
  @IsOptional()
  example: string;

  @ApiProperty({ type: Number })
  @IsPositive()
  reward: number;

  @ApiProperty({ type: String })
  owner: string;

  @ApiProperty({ type: Number })
  owner_id: number;

  @ApiProperty({ type: Date })
  date: Date;
}

export class AllQuestResponse {
  @ApiProperty({ type: QuestResponse })
  quests: QuestResponse[];

  @ApiProperty({ type: Number })
  total: number;
}

export class CreateQuestRequest {
  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  @IsOptional()
  description: string;

  @ApiProperty({ type: String })
  @IsOptional()
  example: string;

  @ApiProperty({ type: Number })
  @IsPositive()
  reward: number;
}

export class UpdateQuestRequest {
  @ApiProperty({ type: String })
  @IsOptional()
  title: string;

  @ApiProperty({ type: String })
  @IsOptional()
  description: string;

  @ApiProperty({ type: String })
  @IsOptional()
  example: string;

  @ApiProperty({ type: Number })
  @IsPositive()
  @IsOptional()
  reward: number;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  status: boolean;
}
