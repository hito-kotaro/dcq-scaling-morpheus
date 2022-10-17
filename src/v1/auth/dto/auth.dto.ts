import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

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
  readonly tenant_name: string;

  @ApiProperty({ type: Number })
  readonly user_id: number;

  @ApiProperty({ type: String })
  readonly user_name: string;
}
