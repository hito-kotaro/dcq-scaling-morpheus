import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lists } from 'src/entity/list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lists])],
  providers: [ListService],
  controllers: [ListController],
})
export class ListModule {}
