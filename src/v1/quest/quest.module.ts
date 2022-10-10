import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quests } from 'src/entity/quest.entity';
import { TenantModule } from '../tenant/tenant.module';
import { UserModule } from '../user/user.module';
import { QuestController } from './quest.controller';
import { QuestService } from './quest.service';

@Module({
  imports: [TenantModule, UserModule, TypeOrmModule.forFeature([Quests])],
  controllers: [QuestController],
  providers: [QuestService],
  exports: [QuestService],
})
export class QuestModule {}
