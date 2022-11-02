import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenants } from 'src/entity/tenant.entity';
import { CreateTenantRequest } from './dto/tenant.dto';
import { TenantService } from './tenant.service';

describe('TenantService', () => {
  let service: TenantService;

  const mockTenantRepository = {
    findOne: jest
      .fn()
      .mockImplementation((option: { where: { id: number } }) => {
        console.log(option);
        return;
        // return {
        //   id: 1,
        //   name: 'TenantA',
        //   password: '',
        //   season_id: 0,
        //   slack_token: '',
        //   created_at: undefined,
        //   updated_at: undefined,
        // };
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return Tenant', async () => {
    const tenantId = 1;
    const result = await service.findOneById(tenantId);
    expect(result).toEqual(1);
  });

  it('should return tenant', async () => {
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
    const result = await service.create(createRequest);
    expect(result).toEqual(createResponse);
  });
});
