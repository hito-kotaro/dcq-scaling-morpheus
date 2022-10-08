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
import { Roles } from './role.entity';
import { Teams } from './team.entity';
import { Tenants } from './tenant.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Index(['tenant', 'user_name'], { unique: true })
export class Users {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @ManyToOne(() => Tenants, (tenant) => tenant.id)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenants;

  @ApiProperty()
  @ManyToOne(() => Roles, (role) => role.id)
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  @ApiProperty()
  @ManyToOne(() => Teams, (team) => team.id)
  @JoinColumn({ name: 'team_id' })
  team: Teams;

  @ApiProperty()
  @Column()
  user_name: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column()
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
