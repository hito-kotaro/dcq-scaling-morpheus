import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teams } from 'src/entity/team.entity';
import { Users } from 'src/entity/user.entity';
import { UserModule } from '../user/user.module';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    // UserModule,
    TypeOrmModule.forFeature([Teams, Users]),
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
