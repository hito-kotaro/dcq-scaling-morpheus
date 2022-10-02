import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { Quests } from './quest.entity';
import { Tenants } from './tenant.entity';
import { Users } from './user.entity';

@Entity()
export class Requests {
  @PrimaryGeneratedColumn({ comment: 'リクエストID' })
  id: number;

  @ManyToOne((type) => Tenants, { cascade: true })
  @JoinColumn()
  tenant: Tenants;

  @ManyToOne((type) => Users, { cascade: true })
  @JoinColumn()
  owner: Users;

  @ManyToOne((type) => Users, { cascade: true })
  @JoinColumn()
  applicant: Users;

  @ManyToOne((type) => Quests, { cascade: true })
  @JoinColumn()
  quest: Quests;

  @Column({ comment: 'リクエストタイトル' })
  title: string;

  @Column({ comment: 'リクエスト内容', type: 'text' })
  description: string;

  @Column({ comment: 'リクエストステータス' })
  status: string;

  @CreateDateColumn({ comment: '登録日時' })
  created_at?: Timestamp;

  @CreateDateColumn({ comment: '更新日時' })
  updated_at?: Timestamp;
}
