import { Test, TestingModule } from '@nestjs/testing';
import { Teams } from 'src/entity/team.entity';
import { Tenants } from 'src/entity/tenant.entity';
import { tokenPayload } from '../auth/dto/auth.dto';
import { CreateTeamRequest, TeamResponse } from './dto/team.dto';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

describe('TeamController', () => {
  let controller: TeamController;

  const token: tokenPayload = {
    tenant_id: 1,
    tenant: 'tenantA',
    user_id: 1,
    user: 'userA',
  };

  const team: TeamResponse = {
    id: 0,
    name: '',
    member: 0,
    point: 0,
    penalty: 0,
    tenant_id: 1,
  };

  const tenant: Tenants = {
    id: 1,
    name: 'TenantA',
    password: 'password',
    season_id: 0,
    slack_token: '',
    created_at: undefined,
    updated_at: undefined,
  };

  const createTeam = { tenant_id: 1, name: 'newTeam' };
  const existTeam = { tenant_id: 1, name: 'TeamA' };
  const fmtTeam: TeamResponse = {
    id: expect.any(Number),
    name: createTeam.name,
    member: 0,
    point: 0,
    penalty: 0,
    tenant_id: createTeam.tenant_id,
  };

  const mockTeamService = {
    findOneByName: jest.fn((name: string) => {
      if (name === 'TeamA') {
        return {
          id: 1,
          tenant,
          name,
          penalty: 0,
          created_at: new Date(),
          updated_at: new Date(),
        };
      } else {
        return;
      }
    }),

    create: jest.fn((createTeam: CreateTeamRequest) => {
      return {
        id: 0,
        tenant: tenant,
        name: createTeam.name,
        penalty: 0,
        created_at: undefined,
        updated_at: undefined,
      };
    }),

    teamExist: jest.fn(() => {
      return null;
    }),

    fmtResponse: jest.fn((team: Teams): TeamResponse => {
      return {
        id: 0,
        name: team.name,
        member: 0,
        point: 0,
        penalty: 0,
        tenant_id: team.tenant.id,
      };
    }),

    findAllByTenantId: jest.fn((): Teams[] => {
      const tenant: Tenants = {
        id: 1,
        name: '',
        password: '',
        season_id: 0,
        slack_token: '',
        created_at: undefined,
        updated_at: undefined,
      };
      return [
        {
          id: 1,
          tenant: tenant,
          name: '',
          penalty: 0,
          created_at: undefined,
          updated_at: undefined,
        },
      ];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [TeamService],
    })
      .overrideProvider(TeamService)
      .useValue(mockTeamService)
      .compile();

    controller = module.get<TeamController>(TeamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // GetAllTeam
  it('should return all teams', async () => {
    const result = await controller.findAll(token);
    expect(result).toEqual({ teams: [team], total: 1 });
  });

  it('should create a new team', async () => {
    const result = await controller.create(createTeam);
    expect(result).toEqual(fmtTeam);
  });

  it('should throw bad request if team already exist ', async () => {
    await expect(() => controller.create(existTeam)).rejects.toThrow(
      'already exist',
    );
  });
});
