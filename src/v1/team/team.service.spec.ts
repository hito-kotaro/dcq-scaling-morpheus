import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { create } from 'domain';
import { Roles } from 'src/entity/role.entity';
import { Teams } from 'src/entity/team.entity';
import { Tenants } from 'src/entity/tenant.entity';
import { Users } from 'src/entity/user.entity';
import { TenantService } from '../tenant/tenant.service';
import { CreateTeamRequest, TeamResponse } from './dto/team.dto';
import { TeamService } from './team.service';

describe('TeamService', () => {
  let service: TeamService;
  const createTeam: CreateTeamRequest = {
    tenant_id: 1,
    name: 'newTeam',
  };
  const dummyTenant: Tenants = {
    id: 1,
    name: 'DummyTenant',
    password: 'password',
    season_id: 1,
    slack_token: 'token',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const dummyTeam: Teams = {
    id: 1,
    tenant: dummyTenant,
    name: 'TeamA',
    penalty: 0,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const dummyNewTeam: Teams = {
    id: 2,
    tenant: dummyTenant,
    name: createTeam.name,
    penalty: 0,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const returnTeam: Teams = {
    id: expect.any(Number),
    tenant: expect.any(Tenants),
    name: expect.any(String),
    penalty: expect.any(Number),
    created_at: expect.any(Date),
    updated_at: expect.any(Date),
  };
  const mockTeamRepository = {
    save: jest
      .fn()
      .mockImplementation((arg: { name: string; tenant: Tenants }) => {
        return {
          id: 2,
          tenant: arg.tenant,
          name: arg.name,
          penalty: 0,
          created_at: dummyNewTeam.created_at,
          updated_at: dummyNewTeam.updated_at,
        };
      }),
    findOne: jest
      .fn()
      .mockImplementation(
        (option: {
          relations: string[];
          where: { id?: number; name?: string };
        }) => {
          // 存在しないidまたは名前を引数で受け取った時はundefinedを返す
          if (option.where.id === 10 || option.where.name === 'NotFoundTeam') {
            return;
          }
          const team: Teams = {
            id: option.where.id ?? 1,
            tenant: new Tenants(),
            name: option.where.name ?? 'TeamA',
            penalty: 0,
            created_at: new Date(),
            updated_at: new Date(),
          };
          return team;
        },
      ),

    // チームDM mock
    find: jest.fn().mockImplementation((tenantId: number): Teams[] => {
      const team: Teams = {
        id: dummyTeam.id,
        tenant: dummyTenant,
        name: dummyTeam.name,
        penalty: dummyTeam.penalty,
        created_at: dummyTeam.created_at,
        updated_at: dummyTeam.updated_at,
      };
      return [team];
    }),
  };

  const mockUserRepository = {
    // idが1であればユーザを返す関数それ以外は存在しないユーザとしてからの配列を返す
    find: jest
      .fn()
      .mockImplementation(
        (option: { ralations: string[]; where: { team: { id: number } } }) => {
          if (option.where.team.id === 1) {
            return [
              {
                id: option.where.team.id,
                tenant: dummyTenant,
                role: new Roles(),
                team: dummyTeam,
                name: 'UserA',
                password: 'password',
                point: 0,
                created_at: new Date(),
                updated_at: new Date(),
              },
            ];
          } else {
            return [];
          }
        },
      ),
  };

  const mockTenantService = {
    findOneById: jest.fn((id: number): Tenants => {
      return dummyTenant;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        TeamService,
        { provide: getRepositoryToken(Teams), useValue: mockTeamRepository },
        { provide: getRepositoryToken(Users), useValue: mockUserRepository },
      ],
    })
      .overrideProvider(TenantService)
      .useValue(mockTenantService)
      .compile();

    service = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // fmtResponseのテスト
  it('should return formated team info', async () => {
    // Teamを受け取って整形したレスポンスを返す

    const team: Teams = {
      id: 1,
      tenant: new Tenants(),
      name: 'TeamA',
      penalty: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await service.fmtResponse(team);
    expect(result).toEqual({
      id: team.id,
      name: team.name,
      member: expect.any(Number),
      point: expect.any(Number),
      penalty: team.penalty,
      tenant_id: team.tenant.id,
    });
  });

  // findOneByIdのテスト
  it('should return team if team id eixst', async () => {
    await expect(await service.findOneById(1)).toEqual(returnTeam);
  });

  it('should return undefined if team id could not foun', async () => {
    await expect(await service.findOneById(10)).toEqual(undefined);
  });

  it('should throw a 400 error if id is not positive', async () => {
    await expect(() => service.findOneById(-1)).rejects.toThrow();
  });

  // findOneByNameのテスト
  it('should return team if team name eixst', async () => {
    await expect(await service.findOneByName('tenantA')).toEqual(returnTeam);
  });

  it('should return undefined if team id could not foun', async () => {
    await expect(await service.findOneByName('NotFoundTeam')).toEqual(
      undefined,
    );
  });

  // findAllByTenantIdのテスト
  // Teamが入った配列を返す
  it('should return team array', async () => {
    const response: Teams[] = [dummyTeam];
    const result = await service.findAllByTenantId(1);
    expect(result).toEqual(response);
  });

  it('should create a new team', async () => {
    expect(await service.create(createTeam)).toEqual(dummyNewTeam);
  });
});
