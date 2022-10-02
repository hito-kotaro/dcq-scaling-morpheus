import { IsString, MaxLength, MinLength } from 'class-validator';

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
