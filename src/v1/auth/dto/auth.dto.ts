import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UserLoginRequest {
  @ApiProperty({ type: String })
  readonly name: string;

  @ApiProperty({ type: String })
  readonly password: string;
}

export class LoginResponse {
  @ApiProperty({ type: String })
  @IsOptional()
  readonly name: string;

  @ApiProperty({ type: String })
  readonly token: string;
}

export class tokenPayload {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  readonly name: string;
}

export class authResponse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  readonly name: string;

  @ApiProperty({ type: String })
  readonly token: string;
}
