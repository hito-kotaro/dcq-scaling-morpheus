import {
  ArgumentMetadata,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Tenants } from 'src/entity/tenant.entity';
import { UpdateTenantRequest } from './dto/tenant.dto';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

describe('UserController', () => {
  const tenantId = 1;
  let controller: TenantController;
  let target: ValidationPipe;
  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: UpdateTenantRequest,
    data: '',
  };
  // 更新前のテナント情報
  const beforeTenant: Tenants = {
    id: 1,
    name: 'tenant',
    password: 'password',
    season_id: 1,
    slack_token: '',
    created_at: undefined,
    updated_at: undefined,
  };

  // mockを定義しておく多分この中にテスト用のダミーメソッドを書く？
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
    findOneById: jest.fn((id: number) => {
      if (id === 1) {
        return {
          id: 1,
          name: '',
          password: '',
          season_id: 0,
          slack_token: '',
          created_at: undefined,
          updated_at: undefined,
        };
      } else {
        return;
      }
    }),

    update: jest.fn((id, updateTenant: UpdateTenantRequest): Tenants => {
      if (id !== 1) {
        throw new NotFoundException('resouece clould not found');
      }
      return {
        id: id,
        name: '',
        password: '',
        season_id: updateTenant.season_id ?? beforeTenant.season_id,
        slack_token: updateTenant.slack_token ?? beforeTenant.slack_token,
        created_at: undefined,
        updated_at: undefined,
      };
    }),
  };
  beforeEach(async () => {
    target = new ValidationPipe();
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

  // it('should get tenatn and exclude passowrd', async () => {
  //   const tenantId = 1;
  //   const resuslt = await controller.findOneById(tenantId);
  //   expect(resuslt).toEqual({
  //     id: expect.any(Number),
  //     name: expect.any(String),
  //     season_id: expect.any(Number),
  //     slack_token: expect.any(String),
  //     created_at: expect.any(Number),
  //     updated_at: expect.any(Number),
  //   });

  //   expect(resuslt).not.toEqual(
  //     expect.objectContaining({ password: expect.any(String) }),
  //   );

  //   // テストしたいメソッドが指定の引数で実行されたかどうか
  //   expect(mockTenantService.findOneById).toHaveBeenCalledWith(tenantId);
  // });

  it('should update a tenant', async () => {
    // 全ての対象を更新するリクエスト
    const allUpdateRequest: UpdateTenantRequest = {
      password: 'newpassword',
      season_id: 1,
      slack_token: 'token',
    };

    // パスワードのみを更新するリクエスト
    const pwdUpdateRequest: UpdateTenantRequest = {
      password: 'newPassword',
    };

    // シーズンIDのみを更新するリクエスト
    const seasonUpdateRequest: UpdateTenantRequest = {
      season_id: 2,
    };

    // slack_tokenのみを更新するリクエスト
    const slackUpdateRequest: UpdateTenantRequest = {
      slack_token: 'slacktokentesttesttestasdkl;agjfisaFji',
    };

    const noUpdateRequest: UpdateTenantRequest = {};

    expect(await target.transform(allUpdateRequest, {} as any)).toEqual(
      allUpdateRequest,
    );

    expect(await controller.update(tenantId, allUpdateRequest)).toEqual({
      id: tenantId,
      name: expect.any(String),
      season_id: allUpdateRequest.season_id,
      slack_token: allUpdateRequest.slack_token,
      created_at: expect.any(Number),
      updated_at: expect.any(Number),
    });

    // パスワードのみアップデートした場合のテスト 他のパラメータは変更なし　&& パスワードは返ってこない
    expect(await controller.update(tenantId, pwdUpdateRequest)).toEqual({
      id: tenantId,
      name: expect.any(String),
      season_id: beforeTenant.season_id,
      slack_token: beforeTenant.slack_token,
      created_at: expect.any(Number),
      updated_at: expect.any(Number),
    });

    // session_idのみ更新した場合のテスト　他のパラメータは変更なし
    expect(await controller.update(tenantId, seasonUpdateRequest)).toEqual({
      id: tenantId,
      name: expect.any(String),
      season_id: seasonUpdateRequest.season_id,
      slack_token: beforeTenant.slack_token,
      created_at: expect.any(Number),
      updated_at: expect.any(Number),
    });

    // slack_tokenのみ更新した場合のテスト　他のパラメータは変更なし
    expect(await controller.update(tenantId, slackUpdateRequest)).toEqual({
      id: tenantId,
      name: expect.any(String),
      season_id: beforeTenant.season_id,
      slack_token: slackUpdateRequest.slack_token,
      created_at: expect.any(Number),
      updated_at: expect.any(Number),
    });

    // 何も更新しなかった場合のテスト　今のデータがそのまま返ってくる
    expect(await controller.update(tenantId, noUpdateRequest)).toEqual({
      id: tenantId,
      name: expect.any(String),
      season_id: beforeTenant.season_id,
      slack_token: beforeTenant.slack_token,
      created_at: expect.any(Number),
      updated_at: expect.any(Number),
    });
  });

  it('should return Bad Request', async () => {
    // Badなリクエスト
    const badUpdateRequest = {
      season_id: 'slacktokentesttesttestasdkl;agjfisaFji',
      password: 100,
      slack_token: 123,
    };

    await target.transform(badUpdateRequest, metadata).catch((err) => {
      expect(err.getResponse().statusCode).toEqual(400);
    });

    await target.transform(badUpdateRequest, metadata).catch((err) => {
      expect(err.getResponse().error).toEqual('Bad Request');
    });

    await target.transform(badUpdateRequest, metadata).catch((err) => {
      expect(err.getResponse().message).toEqual([
        'password must be shorter than or equal to 20 characters',
        'password must be longer than or equal to 8 characters',
        'password must be a string',
        'season_id must be an integer number',
        'slack_token must be a string',
      ]);
    });
  });

  it('should return Not Found ', async () => {
    // 全ての対象を更新するリクエスト
    const allUpdateRequest: UpdateTenantRequest = {
      password: 'newpassword',
      season_id: 1,
      slack_token: 'token',
    };

    try {
      await controller.update(2, allUpdateRequest);
    } catch (error) {
      expect(error.getResponse()).toEqual({
        error: 'Not Found',
        message: 'resouece clould not found',
        statusCode: 404,
      });
    }
  });
});
