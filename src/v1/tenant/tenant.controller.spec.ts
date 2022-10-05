import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenants } from 'src/entity/tenant.entity';
import { Repository } from 'typeorm';
import { CreateTenantDto } from './dto/tenant.dto';
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

  it('findOne method returns a user.', async () => {
    // 独自実装したメソッドでtestデータの生成
    const tenant: Tenants = {
      id: 1,
      tenantName: 'MockunTenant',
      password: 'password',
      seasonId: 1,
      slackId: 'slacknochannelaidexidesu',
      createdAt: new Date('2022/01/01'),
      updatedAt: new Date('2022/01/01'),
    };

    const tenant2: Tenants = {
      id: 111,
      tenant_name: 'MockunTenant2',
      password: 'password2',
      season_id: 2,
      slack_token: 'slacknochannelaidexidesu2',
      created_at: new Date('2022/01/01'),
      updated_at: new Date('2022/01/01'),
    };

    // モックしたい関数のモック実装を渡す
    jest
      .spyOn(mockRepository, 'findOne')
      .mockImplementation(async () => tenant);

    // Get(findOne)のテスト
    const test = await controller.findOne(tenant.id);
    const test2 = await controller.findOne(tenant2.id);
    expect((await controller.findOne(tenant.id)) === tenant2);

    // Post(create)のテスト
    const createTenant: CreateTenantDto = {
      tenant_name: 'MockunTenant2',
      password: 'password',
    };

    expect(await controller.create(createTenant));
  });
});
