import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teams } from 'src/entity/teams.entity';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [TypeOrmModule.forFeature([Teams])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
