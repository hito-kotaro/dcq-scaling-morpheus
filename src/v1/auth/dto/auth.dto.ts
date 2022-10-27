import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class TenantLoginRequest {
  @ApiProperty({ type: String })
  readonly tenant_name: string;

  @ApiProperty({ type: String })
  readonly password: string;
}

export class UserLoginRequest extends TenantLoginRequest {
  @ApiProperty({ type: String })
  readonly user_name: string;
}

export class TenantLoginResponse {
  @ApiProperty({ type: Number })
  readonly tenant_id: number;

  @ApiProperty({ type: String })
  readonly tenant_name: string;
}

export class LoginResponse {
  @ApiProperty({ type: Number })
  readonly tenant_id: number;

  @ApiProperty({ type: String })
  readonly tenant_name: string;

  @ApiProperty({ type: String })
  @IsOptional()
  readonly user_name?: string;

  @ApiProperty({ type: String })
  readonly access_token: string;
}

export class tokenPayload {
  @ApiProperty({ type: Number })
  readonly tenant_id: number;

  @ApiProperty({ type: String })
  readonly tenant: string;

  @ApiProperty({ type: Number })
  readonly user_id: number;

  @ApiProperty({ type: String })
  readonly user: string;
}

export class SignUptRequest {
  @ApiProperty({ type: String, description: 'テナント名' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly name: string;
  @ApiProperty({ type: String, description: 'テナントパスワード' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly password: string;
}

export class SignUptResponse {
  @ApiProperty({ type: Number, description: 'テナントID' })
  readonly id: number;

  @ApiProperty({ type: String, description: 'テナント名' })
  @IsString()
  readonly name: string;

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

export class authResponse {
  @ApiProperty({ type: Number })
  readonly tenant_id: number;

  @ApiProperty({ type: String })
  readonly tenant: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  readonly user_id?: number;

  @ApiProperty({ type: String })
  @IsOptional()
  readonly user?: string;

  @ApiProperty({ type: String })
  readonly access_token: string;
}
