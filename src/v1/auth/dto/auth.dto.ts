import { ApiProperty } from '@nestjs/swagger';

export class TenantLoginParamDto {
  @ApiProperty({ type: String })
  readonly tenant_name: string;

  @ApiProperty({ type: String })
  readonly password: string;
}

export class UserLoginParamDto extends TenantLoginParamDto {
  @ApiProperty({ type: String })
  readonly user_name: string;
}
