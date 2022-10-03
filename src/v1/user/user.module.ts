import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/entity/role.entity';
import { Teams } from 'src/entity/teams.entity';
import { Tenants } from 'src/entity/tenant.entity';
import { Users } from 'src/entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Tenants, Roles, Teams])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
