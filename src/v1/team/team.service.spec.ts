import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Teams } from 'src/entity/team.entity';
import { Tenants } from 'src/entity/tenant.entity';
import { Users } from 'src/entity/user.entity';
import { TenantService } from '../tenant/tenant.service';
import { CreateTeamRequest } from './dto/team.dto';
import { TeamService } from './team.service';

describe('TeamService', () => {
  let service: TeamService;

  const returnTeam: Teams = {
    id: expect.any(Number),
    tenant: expect.any(Tenants),
    name: expect.any(String),
    penalty: expect.any(Number),
    created_at: expect.any(Date),
    updated_at: expect.any(Date),
  };
  const mockTeamRepository = {
    findOne: jest.fn().mockImplementation((id?: number, name?: string) => {
      // 存在しないidまたは名前を引数で受け取った時はundefinedを返す
      if (id === 10 || name === 'NotFoundTeam') {
        return;
      }
      const team: Teams = {
        id: id ?? 1,
        tenant: new Tenants(),
        name: name ?? 'TeamA',
        penalty: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };
      return team;
    }),

    // チームDM mock
    find: jest.fn().mockImplementation((tenantId: number): Teams[] => {
      const team: Teams = {
        id: 0,
        tenant: new Tenants(),
        name: '',
        penalty: 0,
        created_at: undefined,
        updated_at: undefined,
      };
      return [team];
    }),
  };

  const mockUserRepository = {};

  const mockTenantService = {
    findOneById: jest.fn((id: number): Tenants => {
      return {
        id,
        name: '',
        password: '',
        season_id: 0,
        slack_token: '',
        created_at: new Date(),
        updated_at: new Date(),
      };
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
  it('should return formated team info', () => {});

  // findOneByIdのテスト
  it('should return team if team id eixst', async () => {
    const result = await service.findOneById(1);
    console.log(result);
    await expect(result).toEqual(returnTeam);
  });

  it('should return undefined if team id could not foun', () => {});

  it('should throw a 400 error if id is not positive', async () => {
    await expect(() => service.findOneById(-1)).rejects.toThrow();
  });

  it('should return teams', async () => {
    const response: Teams[] = [
      {
        id: 0,
        tenant: new Tenants(),
        name: '',
        penalty: 0,
        created_at: undefined,
        updated_at: undefined,
      },
    ];

    const result = await service.findAllByTenantId(1);
    expect(result).toEqual(response);
  });

  it('should create a new team', async () => {
    const createTeam: CreateTeamRequest = {
      tenant_id: 0,
      name: 'newTeam',
    };
    const result = await service.create(createTeam);
    expect(result).toEqual(1);
  });
});
