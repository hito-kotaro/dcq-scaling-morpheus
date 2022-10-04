import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenants } from 'src/entity/tenant.entity';
import { Repository } from 'typeorm';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

describe('TenantService', () => {
  let service: TenantService;
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
    service = module.get<TenantService>(TenantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
