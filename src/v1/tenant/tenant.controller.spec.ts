import { Test, TestingModule } from '@nestjs/testing';
import { Tenants } from 'src/entity/tenant.entity';
import { UpdateTenantRequest } from './dto/tenant.dto';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

describe('UserController', () => {
  let controller: TenantController;

  // mockを定義しておく　多分この中にテスト用のダミーメソッドを書く？
  const mockTenantService = {
    fmtResponse: jest.fn((tenant: Tenants) => {
      return {
        id: tenant.id,
        name: tenant.name,
        season_id: tenant.season_id,
        slack_token: tenant.slack_token,
        created_at: Date.now(),
        updated_at: Date.now(),
      };
    }),
    findOneById: jest.fn((): Tenants => {
      return {
        id: 0,
        name: '',
        password: '',
        season_id: 0,
        slack_token: '',
        created_at: undefined,
        updated_at: undefined,
      };
    }),
    update: jest.fn((id, updateTenant: UpdateTenantRequest): Tenants => {
      console.log(updateTenant);
      return {
        id: id,
        name: '',
        password: '',
        season_id: updateTenant.season_id,
        slack_token: updateTenant.slack_token,
        created_at: undefined,
        updated_at: undefined,
      };
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [TenantService],
    })
      // ここでUserServiceに定義したmockをオーバーライドしている->だからDIの依存解決ができていなくでも通る？
      .overrideProvider(TenantService)
      .useValue(mockTenantService)
      .compile();

    controller = module.get<TenantController>(TenantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get tenatn and exclude passowrd', async () => {
    const tenantId = 1;
    const resuslt = await controller.findOneById(tenantId);
    expect(resuslt).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      season_id: expect.any(Number),
      slack_token: expect.any(String),
      created_at: expect.any(Number),
      updated_at: expect.any(Number),
    });

    expect(resuslt).not.toEqual(
      expect.objectContaining({ password: expect.any(String) }),
    );

    // テストしたいメソッドが指定の引数で実行されたかどうか
    expect(mockTenantService.findOneById).toHaveBeenCalledWith(tenantId);
  });

  it('should update a tenant', async () => {
    const tenantId = 1;
    const updateRequest: UpdateTenantRequest = {
      password: 'newpassword',
      season_id: 1,
      slack_token: 'token',
    };
    const result = await controller.update(tenantId, updateRequest);
    console.log(result);
    expect(result).toEqual({
      id: tenantId,
      name: expect.any(String),
      season_id: updateRequest.season_id,
      slack_token: updateRequest.slack_token,
      created_at: expect.any(Number),
      updated_at: expect.any(Number),
    });
  });
});
