import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './v1/tenant/tenant.module';
import { RoleModule } from './v1/role/role.module';
import { TeamModule } from './v1/team/team.module';
import { UserModule } from './v1/user/user.module';
import { QuestModule } from './v1/quest/quest.module';
import { RequestModule } from './v1/request/request.module';
import { PenaltyModule } from './v1/penalty/penalty.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
    }),
    UserModule,
    TenantModule,
    RoleModule,
    TeamModule,
    QuestModule,
    RequestModule,
    PenaltyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
