import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { request } from 'express';
import { Tenants } from 'src/entity/tenant.entity';
import { Repository } from 'typeorm';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

describe('TenantController', () => {
  let controller: TenantController;
  let mockRepository: Repository<Tenants>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [
        TenantService,
        { provide: getRepositoryToken(Tenants), useClass: Repository },
      ],
    }).compile();

    mockRepository = module.get<Repository<Tenants>>(
      getRepositoryToken(Tenants),
    );
    controller = module.get<TenantController>(TenantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
