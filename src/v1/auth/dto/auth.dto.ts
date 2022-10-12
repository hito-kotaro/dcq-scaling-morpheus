import { ApiProperty } from '@nestjs/swagger';

export class LoginParamDto {
  @ApiProperty({ type: String })
  readonly tenant_name: string;

  @ApiProperty({ type: String })
  readonly user_name: string;

  @ApiProperty({ type: String })
  readonly password: string;
}
