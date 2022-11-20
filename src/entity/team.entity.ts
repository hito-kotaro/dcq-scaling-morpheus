import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['name'], { unique: true })
export class Teams {
  @ApiProperty()
  @PrimaryGeneratedColumn({ comment: 'チームID' })
  id: number;

  @ApiProperty()
  @PrimaryColumn()
  @Column({ comment: 'チーム名' })
  name: string;

  @ApiProperty()
  @Column({ comment: 'ペナルティポイント', default: 0 })
  penalty: number;

  @ApiProperty()
  @Column({ comment: 'ポイント', default: 0 })
  point: number;

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
