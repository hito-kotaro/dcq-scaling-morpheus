import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { Users } from 'src/entity/user.entity';

export class GetUsersResponse {
  @ApiProperty({ type: [Users] })
  users: Users[];
}

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly username!: string;
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly password!: string;
}
