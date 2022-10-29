import { Test, TestingModule } from '@nestjs/testing';
import { Tenants } from 'src/entity/tenant.entity';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

describe('UserController', () => {
  let controller: TenantController;

  // mockを定義しておく　多分この中にテスト用のダミーメソッドを書く？
  const mockTenantService = {
    fmtResponse: jest.fn(() => {
      return {
        id: 1,
        name: 'test',
        session_id: '',
        slack_token: '',
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

  it('should be get tenatn and exclude passowrd', async () => {
    const resuslt = await controller.findOneById(1);
    expect(resuslt).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      session_id: expect.any(String),
      slack_token: expect.any(String),
      created_at: expect.any(Number),
      updated_at: expect.any(Number),
    });

    expect(resuslt).not.toEqual(
      expect.objectContaining({ password: expect.any(String) }),
    );
  });
});
