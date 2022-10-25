import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class PenaltyResponse {
  @ApiProperty({ type: Number })
  readonly id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  @IsOptional()
  description: string;

  @ApiProperty({ type: Number })
  @IsPositive()
  penalty: number;
  @ApiProperty({ type: String })
  readonly owner: string;

  @ApiProperty({ type: Number })
  readonly owner_id: number;

  @ApiProperty({ type: Date })
  date: Date;
}

export class AllPenaltyResponse {
  @ApiProperty({ type: PenaltyResponse })
  readonly penalties: PenaltyResponse[];

  @ApiProperty({ type: Number })
  readonly total: number;
}

export class CreatePenaltyRequest {
  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  @IsPositive()
  penalty: number;
}

export class UpdatePenaltyRequest {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  @IsOptional()
  title: string;

  @ApiProperty({ type: String })
  @IsOptional()
  description: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  penalty: number;
}
