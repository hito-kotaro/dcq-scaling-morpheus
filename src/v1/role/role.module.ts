import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/entity/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
