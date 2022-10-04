import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class GetOneTenantResponse {
  @ApiProperty({ type: Number, description: 'テナントID' })
  readonly id: number;

  @ApiProperty({ type: String, description: 'テナント名' })
  @IsString()
  readonly tenantName: string;

  @ApiProperty({ type: String, description: 'テナントパスワード' })
  password: string;

  @ApiProperty({ type: Number, description: 'シーズン設定' })
  seasonId: number;

  @ApiProperty({ type: Number, description: 'slack設定' })
  slackId: string;

  @ApiProperty({ type: Date, description: '登録日時' })
  readonly createdAt: Date;

  @ApiProperty({ type: Date, description: '更新日時' })
  updatedAt: Date;
}

export class TenantSuccessResponse {
  @ApiProperty({ type: Number, description: 'テナントID' })
  readonly tenantId!: number;

  @ApiProperty({ type: String, description: 'メッセージ' })
  readonly message: string;
}

export class CreateTenantDto {
  @ApiProperty({ type: String, description: 'テナント名' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly tenantName!: string;
  @ApiProperty({ type: String, description: 'テナントパスワード' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly password!: string;
}

export class UpdateTenantDto {
  @ApiProperty({ type: Number, description: 'テナントID' })
  readonly id: number;
  @ApiProperty({ type: String, description: 'テナントパスワード' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsOptional()
  password?: string;
  @ApiProperty({ type: Number, description: 'シーズンID' })
  @IsString()
  @IsOptional()
  seasonId?: number;
  @ApiProperty({ type: String, description: 'SlackID' })
  @IsString()
  @IsOptional()
  slackId?: string;
}
