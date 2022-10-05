import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Tenants {
  @ApiProperty()
  @PrimaryGeneratedColumn({ comment: 'テナントID' })
  id: number;

  @ApiProperty()
  @Column({ comment: 'テナント名', unique: true })
  tenant_name: string;

  @ApiProperty()
  @Column({ comment: 'テナントパスワード' })
  password: string;

  @ApiProperty()
  @Column({ comment: 'シーズンID', default: 1 })
  season_id: number;

  @ApiProperty()
  @Column({ comment: 'slack連携トークン', default: '' })
  slack_token: string;

  @ApiProperty()
  @CreateDateColumn({
    // name: 'created_at',
    type: 'timestamp',
    precision: 0,
    comment: '登録日時',
  })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({
    // name: 'updated_at',
    type: 'timestamp',
    precision: 0,
    comment: '更新日時',
  })
  updated_at: Date;
}
