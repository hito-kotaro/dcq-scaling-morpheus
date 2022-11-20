import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';

@Entity()
@Index(['title'], { unique: true })
export class Quests {
  @ApiProperty()
  @PrimaryGeneratedColumn({ comment: 'クエストID' })
  id: number;

  @ApiProperty()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  owner: Users;

  @ApiProperty()
  @Column({ comment: 'クエストタイトル' })
  title: string;

  @ApiProperty()
  @Column({ comment: 'クエスト内容', type: 'text' })
  description: string;

  @ApiProperty()
  @Column({ comment: 'クエスト報告内容サンプル', type: 'text' })
  example: string;

  @ApiProperty()
  @Column({ comment: '獲得ポイント' })
  reward: number;

  @ApiProperty()
  @Column({ comment: 'クエストステータス' })
  status: boolean;

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
