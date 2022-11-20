import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issues } from 'src/entity/issue.entity';
import { PenaltyModule } from '../penalty/penalty.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PenaltyModule, UserModule, TypeOrmModule.forFeature([Issues])],
  providers: [IssueService],
  controllers: [IssueController],
})
export class IssueModule {}
