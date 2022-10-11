import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';
import { Tenants } from 'src/entity/tenant.entity';
import { Users } from 'src/entity/user.entity';

export class FindOnePenaltyResponse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  @IsOptional()
  description: string;

  @ApiProperty({ type: Number })
  @IsPositive()
  penalty: number;

  @ApiProperty({ type: Tenants })
  readonly tenant: Tenants;

  @ApiProperty({ type: Users })
  readonly owner: Users;
}

export class FindAllPenaltyResponse {
  @ApiProperty({ type: FindOnePenaltyResponse })
  penalties: FindOnePenaltyResponse[];

  @ApiProperty({ type: Number })
  total: number;
}

export class CreatePenaltyDto {
  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  @IsPositive()
  penalty: number;

  @ApiProperty({ type: Number })
  tenant_id: number;

  @ApiProperty({ type: Number })
  owner_id: number;
}

export class UpdatePenaltyDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  @IsOptional()
  title: string;

  @ApiProperty({ type: String })
  @IsOptional()
  description: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  penalty: number;
}

export class PenaltySuccessResponse {
  @ApiProperty({ type: Number, description: 'ペナルティID' })
  readonly id: number;

  @ApiProperty({ type: String, description: 'メッセージ' })
  readonly message: string;
}
