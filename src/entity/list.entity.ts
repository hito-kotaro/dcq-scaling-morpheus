import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['title'], { unique: true })
export class Lists {
  @PrimaryGeneratedColumn({ comment: 'どりかむリストID' })
  id: number;

  @Column({ comment: 'どりかむリストタイトル' })
  title: string;

  @Column({ comment: 'どりかむリスト内容', type: 'text' })
  description: string;

  @Column({ comment: '必要ポイント' })
  point: number;

  @Column({ comment: '登録者' })
  created_by: string;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    comment: '登録日時',
  })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    precision: 0,
    comment: '更新日時',
  })
  updated_at: Date;
}
