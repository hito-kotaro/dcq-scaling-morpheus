import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenants } from 'src/entity/tenant.entity';
import { TeamModule } from '../team/team.module';
import { UserModule } from '../user/user.module';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => TeamModule),
    TypeOrmModule.forFeature([Tenants]),
  ],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
