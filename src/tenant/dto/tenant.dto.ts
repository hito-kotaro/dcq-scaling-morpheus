import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class GetOneTenantResponse {
  @ApiProperty({ type: Number, description: 'テナントID' })
  readonly id: number;

  @ApiProperty({ type: String, description: 'テナント名' })
  @IsString()
  readonly tenantName: string;

  @ApiProperty({ type: Number, description: 'シーズン設定' })
  readonly season: number;

  @ApiProperty({ type: Number, description: 'slack設定' })
  readonly slack: string;

  @ApiProperty({ type: Date, description: '登録日時' })
  readonly createdAt: Date;

  @ApiProperty({ type: Date, description: '更新日時' })
  readonly updatedAt: Date;
}

export class CreateTenantResponse {
  @ApiProperty({ type: Number, description: 'テナントID' })
  readonly tenantId!: number;
}

export class CreateTenantDto {
  @ApiProperty({ type: String, description: 'テナント名' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly tenantName!: string;
  @ApiProperty({ type: String, description: 'テナントパスワード' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly password!: string;
}
