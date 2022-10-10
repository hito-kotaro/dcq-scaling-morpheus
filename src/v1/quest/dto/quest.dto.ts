import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';
import { Tenants } from 'src/entity/tenant.entity';
import { Users } from 'src/entity/user.entity';

export class FindOneQuestResponse {
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

  @ApiProperty({ type: Boolean })
  status: boolean;

  @ApiProperty({ type: Tenants })
  readonly tenant: Tenants;

  @ApiProperty({ type: Users })
  readonly owner: Users;
}

export class FindAllQuestResponse {
  @ApiProperty({ type: FindOneQuestResponse })
  quests: FindOneQuestResponse[];

  @ApiProperty({ type: Number })
  total: number;
}

export class CreateQuestDto {
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

  @ApiProperty({ type: Number })
  tenant_id: number;

  @ApiProperty({ type: Number })
  owner_id: number;
}

export class QuestSuccessResponse {
  @ApiProperty({ type: Number, description: 'クエストID' })
  readonly id: number;

  @ApiProperty({ type: String, description: 'メッセージ' })
  readonly message: string;
}

export class UpdateQuestDto {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  @IsOptional()
  updated_title: string;

  @ApiProperty({ type: String })
  @IsOptional()
  updated_description: string;

  @ApiProperty({ type: String })
  @IsOptional()
  updated_example: string;

  @ApiProperty({ type: Number })
  @IsPositive()
  @IsOptional()
  updated_reward: number;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  updated_status: boolean;
}
