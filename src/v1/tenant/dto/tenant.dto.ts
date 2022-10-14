import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsInt,
} from 'class-validator';

export class GetOneTenantResponse {
  // @ApiProperty({ type: Tenants, description: 'テナント情報' })
  // tenant: Tenants;
  @ApiProperty({ type: Number, description: 'テナントID' })
  readonly id: number;

  @ApiProperty({ type: String, description: 'テナント名' })
  @IsString()
  readonly tenant_name: string;

  @ApiProperty({ type: String, description: 'テナントパスワード' })
  password: string;

  @ApiProperty({ type: Number, description: 'シーズン設定' })
  season_id: number;

  @ApiProperty({ type: Number, description: 'slack設定' })
  slack_token: string;

  @ApiProperty({ type: Date, description: '登録日時' })
  readonly created_at: Date;

  @ApiProperty({ type: Date, description: '更新日時' })
  updated_at: Date;
}

export class TenantSuccessResponse {
  @ApiProperty({ type: Number, description: 'テナントID' })
  readonly tenant_id: number;

  @ApiProperty({ type: String, description: 'メッセージ' })
  readonly message: string;
}

export class CreateTenantRequest {
  @ApiProperty({ type: String, description: 'テナント名' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly tenant_name: string;
  @ApiProperty({ type: String, description: 'テナントパスワード' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly password: string;
}

export class UpdateTenantRequest {
  @ApiProperty({ type: String, description: 'テナントパスワード' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsOptional()
  password?: string;
  @ApiProperty({ type: Number, description: 'シーズンID' })
  @IsInt()
  @IsOptional()
  season_id?: number;
  @ApiProperty({ type: String, description: 'SlackID' })
  @IsString()
  @IsOptional()
  slack_token?: string;
}
