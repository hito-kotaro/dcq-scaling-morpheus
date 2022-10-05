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
import { Penalties } from './penalty.entity';
import { Teams } from './team.entity';
import { Tenants } from './tenant.entity';
import { Users } from './user.entity';

@Entity()
@Index(['tenant', 'title'], { unique: true })
export class Issues {
  @PrimaryGeneratedColumn({ comment: '発行済みペナルティID' })
  id: number;

  @ManyToOne((type) => Tenants, { cascade: true })
  @JoinColumn()
  tenant: Tenants;

  @ManyToOne((type) => Users, { cascade: true })
  @JoinColumn()
  authorizer: Users;

  @ManyToOne((type) => Teams, { cascade: true })
  @JoinColumn()
  team: Teams;

  @ManyToOne((type) => Penalties, { cascade: true })
  @JoinColumn()
  penalty: Penalties;

  @Column({ comment: 'ペナルティ付与タイトル' })
  title: string;

  @Column({ comment: 'ペナルティ付与コメント', type: 'text' })
  comment: string;

  @CreateDateColumn({ comment: '登録日時' })
  created_at?: Timestamp;

  @CreateDateColumn({ comment: '更新日時' })
  updated_at?: Timestamp;
}
