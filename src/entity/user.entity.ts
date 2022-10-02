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
import { Roles } from './role.entity';
import { Teams } from './teams.entity';
import { Tenants } from './tenant.entity';

@Entity()
@Index(['tenant', 'name'], { unique: true })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Tenants, { cascade: true })
  @JoinColumn()
  tenant: Tenants;

  @ManyToOne((type) => Roles, { cascade: true })
  @JoinColumn()
  role: Roles;

  @ManyToOne((type) => Teams, { cascade: true })
  @JoinColumn()
  team: Teams;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  point: number;

  @CreateDateColumn({ comment: '登録日時' })
  created_at?: Timestamp;

  @CreateDateColumn({ comment: '更新日時' })
  updated_at?: Timestamp;
}
