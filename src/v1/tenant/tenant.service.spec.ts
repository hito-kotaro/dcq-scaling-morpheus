import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenants } from 'src/entity/tenant.entity';
import { CreateTenantRequest } from './dto/tenant.dto';
import { TenantService } from './tenant.service';

describe('TenantService', () => {
  let service: TenantService;
  const testTenant: Tenants = {
    id: 1,
    name: 'TenantA',
    password: expect.any(String),
    season_id: expect.any(Number),
    slack_token: expect.any(String),
    created_at: expect.any(Date),
    updated_at: expect.any(Date),
  };

  const createRequest: CreateTenantRequest = {
    name: 'NewTenant',
    password: 'password',
  };

  const createResponse: Tenants = {
    id: expect.any(Number),
    name: createRequest.name,
    password: expect.any(String),
    season_id: 0,
    slack_token: '',
    created_at: expect.any(Date),
    updated_at: expect.any(Date),
  };

  // const callErrorFun = async (): Promise<void> => {
  //   throw new NotFoundException('error');
  // };

  const mockTenantRepository = {
    findOne: jest.fn().mockImplementation(() => {
      return {
        id: 1,
        name: 'TenantA',
        password: '',
        season_id: 0,
        slack_token: '',
        created_at: new Date(),
        updated_at: new Date(),
      };
    }),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((tenant) =>
      Promise.resolve({
        id: 1,
        slack_token: '',
        season_id: 0,
        created_at: new Date(),
        updated_at: new Date(),
        ...tenant,
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: getRepositoryToken(Tenants),
          useValue: mockTenantRepository,
        },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
  });

  // it('サンプルthrow、部分一致', async () => {
  //   await expect(callErrorFun()).rejects.toThrow('error');
  // });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw 404 error if tenant not found ', () => {
    const tenant = undefined;
    expect(() => service.validate(tenant)).toThrow('resource could not found');
  });

  it('should not throw 404 error if tenant exist ', () => {
    const tenant = 'tenant';
    expect(() => service.validate(tenant)).not.toThrow(
      'resource could not found',
    );
  });

  it('should return tenant if tenant id exist', async () => {
    const tenantId = 1;
    const result = await service.findOneById(tenantId);
    expect(result).toEqual(testTenant);
  });

  it('should return tenant if tenant name exist', async () => {
    const tenantName = 'TenantA';
    const result = await service.findOneByName(tenantName);
    expect(result).toEqual(testTenant);
  });

  it('should return tenant if create success', async () => {
    const result = await service.create(createRequest);
    expect(result).toEqual(createResponse);
  });
});
