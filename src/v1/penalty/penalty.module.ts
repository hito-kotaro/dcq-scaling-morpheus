import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Penalties } from 'src/entity/penalty.entity';
import { TenantModule } from '../tenant/tenant.module';
import { UserModule } from '../user/user.module';
import { PenaltyController } from './penalty.controller';
import { PenaltyService } from './penalty.service';

@Module({
  imports: [TenantModule, UserModule, TypeOrmModule.forFeature([Penalties])],
  controllers: [PenaltyController],
  providers: [PenaltyService],
  exports: [PenaltyService],
})
export class PenaltyModule {}
