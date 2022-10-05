import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tenants } from './tenant.entity';

@Entity()
@Index(['tenant', 'team_name'], { unique: true })
export class Teams {
  @ApiProperty()
  @PrimaryGeneratedColumn({ comment: 'チームID' })
  id: number;

  @ApiProperty()
  @ManyToOne((type) => Tenants, (tenant) => tenant.id)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenants;

  @ApiProperty()
  @PrimaryColumn()
  @Column({ comment: 'チーム名' })
  team_name: string;

  @ApiProperty()
  @Column({ comment: 'ペナルティポイント', default: 0 })
  penalty: number;

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
