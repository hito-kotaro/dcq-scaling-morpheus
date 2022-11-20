import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UserLoginRequest {
  @ApiProperty({ type: String })
  readonly user_name: string;

  @ApiProperty({ type: String })
  readonly password: string;
}

export class LoginResponse {
  @ApiProperty({ type: String })
  @IsOptional()
  readonly user_name?: string;

  @ApiProperty({ type: String })
  readonly access_token: string;
}

export class tokenPayload {
  @ApiProperty({ type: Number })
  readonly user_id: number;

  @ApiProperty({ type: String })
  readonly user: string;
}

export class authResponse {
  @ApiProperty({ type: Number })
  @IsOptional()
  readonly user_id: number;

  @ApiProperty({ type: String })
  @IsOptional()
  readonly user: string;

  @ApiProperty({ type: String })
  readonly access_token: string;
}
