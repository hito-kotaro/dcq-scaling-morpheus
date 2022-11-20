import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Penalties } from 'src/entity/penalty.entity';
import { UserModule } from '../user/user.module';
import { PenaltyController } from './penalty.controller';
import { PenaltyService } from './penalty.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Penalties])],
  controllers: [PenaltyController],
  providers: [PenaltyService],
  exports: [PenaltyService],
})
export class PenaltyModule {}
