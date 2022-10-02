import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn({ comment: 'ロールID' })
  id: number;

  @Column({ comment: 'ロール名' })
  name: string;

  @CreateDateColumn({ comment: '登録日時' })
  created_at?: Timestamp;

  @CreateDateColumn({ comment: '更新日時' })
  updated_at?: Timestamp;
}
