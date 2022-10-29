import { Test, TestingModule } from '@nestjs/testing';
import { Teams } from 'src/entity/team.entity';
import { Tenants } from 'src/entity/tenant.entity';
import { tokenPayload } from '../auth/dto/auth.dto';
import { TeamResponse } from './dto/team.dto';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

describe('TeamController', () => {
  let controller: TeamController;

  const mockTeamService = {
    fmtResponse: jest.fn((team: Teams): TeamResponse => {
      return {
        id: 0,
        name: team.name,
        member: 0,
        point: 0,
        penalty: 0,
        tenant_id: 0,
      };
    }),

    findAllByTenantId: jest.fn((): Teams[] => {
      return [
        {
          id: 0,
          tenant: new Tenants(),
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

  it('should return all teams', async () => {
    const user: tokenPayload = {
      tenant_id: 1,
      tenant: 'tenantA',
      user_id: 1,
      user: 'userA',
    };

    const teams: TeamResponse = {
      id: 0,
      name: '',
      member: 0,
      point: 0,
      penalty: 0,
      tenant_id: 0,
    };
    const result = await controller.findAll(user);
    expect(result).toEqual({ teams: [teams], total: 1 });
  });
});
