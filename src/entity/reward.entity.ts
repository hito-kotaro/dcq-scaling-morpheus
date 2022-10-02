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

@Entity()
@Index(['tenant', 'title'], { unique: true })
export class Rewards {
  @PrimaryGeneratedColumn({ comment: 'どりかむリストID' })
  id: number;

  @ManyToOne((type) => Tenants, { cascade: true })
  @JoinColumn()
  tenant: Tenants;

  @Column({ comment: 'どりかむリストタイトル' })
  title: string;

  @Column({ comment: 'どりかむリスト内容', type: 'text' })
  description: string;

  @Column({ comment: '必要ポイント' })
  point: number;

  @CreateDateColumn({ comment: '登録日時' })
  created_at?: Timestamp;

  @CreateDateColumn({ comment: '更新日時' })
  updated_at?: Timestamp;
}
