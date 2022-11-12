import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { Requests } from 'src/entity/request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestModule } from '../quest/quest.module';
import { UserModule } from '../user/user.module';
import { TenantModule } from '../tenant/tenant.module';
import { Users } from 'src/entity/user.entity';
import { Teams } from 'src/entity/team.entity';
import { TeamModule } from '../team/team.module';

@Module({
  imports: [
    TenantModule,
    QuestModule,
    UserModule,
    TeamModule,
    TypeOrmModule.forFeature([Requests, Users, Teams]),
  ],
  providers: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}
