import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenants } from 'src/entity/tenant.entity';
import { repositoryMockFactory } from './tenant.mock.spec';
import { TenantService } from './tenant.service';
// テストコード内でServiceでINJECTしているモジュール類に触れない
describe('TenantService', () => {
  let tenantService;
  let tenantRepository;
  // const mockTenantRepository = () => ({
  //   validate: jest.fn(),
  //   findOneById: jest.fn(),
  //   findOneByName: jest.fn(),
  //   create: jest.fn(),
  //   update: jest.fn(),
  // });
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: getRepositoryToken(Tenants),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    tenantService = await moduleRef.get<TenantService>(TenantService);
    tenantRepository = await moduleRef.get(getRepositoryToken(Tenants));
  });

  describe('test', () => {
    it('should return number', async () => {
      tenantRepository.test.mockReturnValue(1);
      const result = await tenantService.test(1);
      console.log(result);
      expect(result).toBe(1);
    });
  });
});
