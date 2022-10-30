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
  const mockTeamRepository = {
    findOne: jest.fn().mockImplementation((exist: boolean) => exist),
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
        id: id,
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
