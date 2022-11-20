import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UserResponse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Number })
  point: number;
}

export class AllUserResponse {
  @ApiProperty({ type: UserResponse })
  readonly users: UserResponse[];

  @ApiProperty({ type: Number })
  readonly total: number;
}

export class CreateUserRequest {
  @ApiProperty({ type: String })
  readonly name: string;

  @ApiProperty({ type: String })
  readonly password: string;
}

export class UpdateUserRequest {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  @IsOptional()
  readonly name: string;

  @IsOptional()
  @ApiProperty({ type: Number })
  readonly add_point: number;
}
