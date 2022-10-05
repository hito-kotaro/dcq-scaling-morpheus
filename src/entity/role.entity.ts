import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn({ comment: 'ロールID' })
  readonly id: number;

  @Column({ comment: 'ロール名' })
  readonly name: string;

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
