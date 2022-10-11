import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { Penalties } from './penalty.entity';
import { Quests } from './quest.entity';
import { Teams } from './team.entity';
import { Tenants } from './tenant.entity';
import { Users } from './user.entity';

@Entity()
@Index(['tenant', 'title'], { unique: true })
export class Issues {
  @PrimaryGeneratedColumn({ comment: '発行済みペナルティID' })
  id: number;

  @ApiProperty()
  @ManyToOne(() => Tenants, (tenant) => tenant.id)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenants;

  @ApiProperty()
  @ManyToOne(() => Penalties, (penalty) => penalty.id)
  @JoinColumn({ name: 'penalty_id' })
  penalty: Quests;

  @ApiProperty()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'authorizer_id' })
  authorizer: Users;

  @ApiProperty()
  @ManyToOne(() => Teams, (team) => team.id)
  @JoinColumn({ name: 'team_id' })
  team: Users;

  @Column({ comment: 'ペナルティ付与タイトル' })
  title: string;

  @Column({ comment: 'ペナルティ付与コメント', type: 'text' })
  comment: string;

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
