import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { Tenants } from './tenant.entity';

@Entity()
@Index(['tenant', 'name'], { unique: true })
export class Teams {
  @PrimaryGeneratedColumn({ comment: 'チームID' })
  id: number;

  @ManyToOne((type) => Tenants, { cascade: true })
  @JoinColumn()
  tenant: Tenants;

  @PrimaryColumn()
  @Column({ comment: 'チーム名' })
  name: string;

  @Column({ comment: 'ペナルティポイント', default: 0 })
  penalty: number;

  @CreateDateColumn({ comment: '登録日時' })
  created_at?: Timestamp;

  @CreateDateColumn({ comment: '更新日時' })
  updated_at?: Timestamp;
}
