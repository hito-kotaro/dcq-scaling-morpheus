import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teams } from 'src/entity/team.entity';
import { TenantModule } from '../tenant/tenant.module';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [TenantModule, TypeOrmModule.forFeature([Teams])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
