import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Teams } from './team.entity';
import { Tenants } from './tenant.entity';
import { Users } from './user.entity';

@Entity()
@Index(['tenant', 'title'], { unique: true })
export class Penalties {
  @PrimaryGeneratedColumn({ comment: 'ペナルティID' })
  id: number;

  @ApiProperty()
  @ManyToOne(() => Tenants, (tenant) => tenant.id)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenants;

  @ApiProperty()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  owner: Users;

  @ApiProperty()
  @Column({ comment: 'ペナルティタイトル' })
  title: string;

  @ApiProperty()
  @Column({ comment: 'ペナルティ内容', type: 'text' })
  description: string;

  @ApiProperty()
  @Column({ comment: 'ペナルティポイント' })
  point: number;

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
