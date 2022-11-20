import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Quests } from './quest.entity';
import { Users } from './user.entity';

@Entity()
export class Requests {
  @PrimaryGeneratedColumn({ comment: 'リクエストID' })
  id: number;

  @ApiProperty()
  @ManyToOne(() => Quests, (quest) => quest.id)
  @JoinColumn({ name: 'quest_id' })
  quest: Quests;

  @ApiProperty()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  applicant: Users;

  @ApiProperty()
  @Column({ comment: 'リクエストタイトル' })
  title: string;

  @ApiProperty()
  @Column({ comment: 'リクエスト内容', type: 'text' })
  description: string;

  @ApiProperty()
  @Column({ comment: 'リクエストステータス' })
  status: string;

  @ApiProperty()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'authorizer_id' })
  authorizer: Users;

  @ApiProperty()
  @Column({ comment: '承認コメント', type: 'text', nullable: true })
  auth_comment: string;

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
