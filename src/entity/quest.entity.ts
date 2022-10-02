import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { Tenants } from './tenant.entity';
import { Users } from './user.entity';

@Entity()
@Index(['tenant', 'title'], { unique: true })
export class Quests {
  @PrimaryGeneratedColumn({ comment: 'クエストID' })
  id: number;

  @ManyToOne((type) => Tenants, { cascade: true })
  @JoinColumn()
  tenant: Tenants;

  @ManyToOne((type) => Users, { cascade: true })
  @JoinColumn()
  owner: Users;

  @Column({ comment: 'クエストタイトル' })
  title: string;

  @Column({ comment: 'クエスト内容', type: 'text' })
  description: string;

  @Column({ comment: 'クエスト報告内容サンプル', type: 'text' })
  example: string;

  @Column({ comment: '獲得ポイント' })
  reward: number;

  @Column({ comment: 'クエストステータス' })
  status: boolean;

  @CreateDateColumn({ comment: '登録日時' })
  created_at?: Timestamp;

  @CreateDateColumn({ comment: '更新日時' })
  updated_at?: Timestamp;
}
