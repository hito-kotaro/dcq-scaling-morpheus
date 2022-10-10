import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { Requests } from 'src/entity/request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestModule } from '../quest/quest.module';
import { UserModule } from '../user/user.module';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [
    TenantModule,
    QuestModule,
    UserModule,
    TypeOrmModule.forFeature([Requests]),
  ],
  providers: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}
