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
export class Penalties {
  @PrimaryGeneratedColumn({ comment: 'ペナルティID' })
  id: number;

  @ManyToOne((type) => Tenants, { cascade: true })
  @JoinColumn()
  tenant: Tenants;

  @ManyToOne((type) => Users, { cascade: true })
  @JoinColumn()
  owner: Users;

  @Column({ comment: 'ペナルティタイトル' })
  title: string;

  @Column({ comment: 'ペナルティ内容', type: 'text' })
  description: string;

  @Column({ comment: 'ペナルティポイント' })
  penalty: number;

  @CreateDateColumn({ comment: '登録日時' })
  created_at?: Timestamp;

  @CreateDateColumn({ comment: '更新日時' })
  updated_at?: Timestamp;
}
