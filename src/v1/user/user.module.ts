import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { RoleModule } from '../role/role.module';
import { TeamModule } from '../team/team.module';
import { TenantModule } from '../tenant/tenant.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    forwardRef(() => TenantModule),
    forwardRef(() => TeamModule),
    RoleModule,
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
