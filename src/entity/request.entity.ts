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
import { Tenants } from './tenant.entity';
import { Users } from './user.entity';

@Entity()
export class Requests {
  @PrimaryGeneratedColumn({ comment: 'リクエストID' })
  id: number;

  @ApiProperty()
  @ManyToOne(() => Tenants, (tenant) => tenant.id)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenants;

  @ApiProperty()
  @ManyToOne(() => Quests, (quest) => quest.id)
  @JoinColumn({ name: 'quest_id' })
  quest: Quests;

  @ApiProperty()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  // fixMe: appilcant -> applicant
  appilcant: Users;

  @Column({ comment: 'リクエストタイトル' })
  title: string;

  @Column({ comment: 'リクエスト内容', type: 'text' })
  description: string;

  @Column({ comment: 'リクエストステータス' })
  status: string;

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
