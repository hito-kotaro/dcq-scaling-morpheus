import { forwardRef, Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { Requests } from 'src/entity/request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestModule } from '../quest/quest.module';
import { UserModule } from '../user/user.module';
import { Users } from 'src/entity/user.entity';

@Module({
  imports: [
    UserModule,
    forwardRef(() => QuestModule),
    TypeOrmModule.forFeature([Requests, Users]),
  ],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
