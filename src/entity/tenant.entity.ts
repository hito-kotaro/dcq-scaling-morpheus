import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity()
export class Tenants {
  @PrimaryGeneratedColumn({ comment: 'テナントID' })
  id: number;

  @Column({ comment: 'テナント名', unique: true })
  tenant_name: string;

  @Column({ comment: 'テナントパスワード' })
  password: string;

  @Column({ comment: 'シーズンID', default: 1 })
  season: number;

  @Column({ comment: 'slack連携ID' })
  slack: string;

  @CreateDateColumn({ comment: '登録日時' })
  created_at?: Timestamp;

  @CreateDateColumn({ comment: '更新日時' })
  updated_at?: Timestamp;
}
