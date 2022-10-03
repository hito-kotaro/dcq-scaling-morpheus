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
import { Teams } from './teams.entity';
import { Tenants } from './tenant.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Index(['tenant', 'name'], { unique: true })
export class Users {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @ManyToOne((type) => Tenants, { cascade: true })
  @JoinColumn()
  tenant: Tenants;

  @ApiProperty()
  @ManyToOne((type) => Roles, { cascade: true })
  @JoinColumn()
  role: Roles;

  @ApiProperty()
  @ManyToOne((type) => Teams, { cascade: true })
  @JoinColumn()
  team: Teams;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column()
  point: number;

  @ApiProperty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    precision: 0,
    comment: '登録日時',
  })
  readonly createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    precision: 0,
    comment: '更新日時',
  })
  readonly updatedAt: Date;
}
