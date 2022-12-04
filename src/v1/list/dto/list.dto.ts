import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class ListResponse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  @IsOptional()
  description: string;

  @ApiProperty({ type: Number })
  @IsPositive()
  point: number;

  @ApiProperty({ type: String })
  created_by: string;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ type: Date })
  updated_at: Date;
}

export class AllListDataResponse {
  @ApiProperty({ type: ListResponse })
  lists: ListResponse[];

  @ApiProperty({ type: Number })
  total: number;
}
