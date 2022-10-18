import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teams } from 'src/entity/team.entity';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { TenantService } from '../tenant/tenant.service';
import {
  CreateTeamRequest,
  FindAllTeamResponse,
  FindOneTeamResponse,
  TeamSuccessResponse,
  UpdateTeamRequest,
} from './dto/team.dto';

@Injectable()
export class TeamService {
  constructor(
    private readonly tenantService: TenantService,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Teams) private teamRepository: Repository<Teams>,
  ) {}

  // チーム情報の集計
  async teamSummary(team_id: number) {
    // member集計
    const users: Users[] = await this.userRepository.find({
      relations: ['role', 'team', 'tenant'],
      where: { team: { id: team_id } },
    });

    let point = 0;
    console.log(users);
    users.map((u: Users) => (point = point + u.point));

    const teamInfo = {
      member: users.length,
      point,
    };

    return teamInfo;
  }

  //特定チームの取得
  async findOne(id: number): Promise<FindOneTeamResponse> {
    if (!id) {
      throw new BadRequestException('team id is empty');
    }

    const team = await this.teamRepository.findOne({
      relations: ['tenant'],
      where: { id },
    });

    const teamInfo = await this.teamSummary(id);

    if (!team) {
      throw new NotFoundException('team could not found');
    }

    const response: FindOneTeamResponse = {
      id: team.id,
      team_name: team.team_name,
      member: teamInfo.member,
      point: teamInfo.point,
      penalty: team.penalty,
      tenant_id: team.tenant.id,
    };
    console.log(response);

    return response;
  }

  //テナント内の全チーム取得
  async findAll(tenantId: number): Promise<FindAllTeamResponse> {
    // const teamList: FindOneTeamResponse[] = [];
    const teams = await this.teamRepository.find({
      relations: ['tenant'],
      where: { tenant: { id: tenantId } },
    });

    const teamList = [];
    const makeList = async () => {
      // eslint-disable-next-line prefer-const
      for (let t of teams) {
        teamList.push(await this.findOne(t.id));
      }
    };
    await makeList();

    const response = {
      total: teamList.length,
      teams: teamList,
    };

    return response;
  }

  // チーム作成
  async create(team: CreateTeamRequest): Promise<TeamSuccessResponse> {
    // 対象のテナントを取得
    const tenant = await this.tenantService.findOneById(team.tenant_id);

    const isExist = await this.teamRepository.findOne({
      relations: ['tenant'],
      where: { team_name: team.team_name, tenant: { id: team.tenant_id } },
    });

    if (isExist) {
      throw new BadRequestException(`${team.team_name} already exist`);
    }

    const createdTeam = await this.teamRepository.save({
      team_name: team.team_name,
      tenant: tenant,
    });

    return { id: createdTeam.id, message: 'create success' };
  }

  // チーム更新
  // 更新可能なパラメータ:penalty, name
  async update(
    id: number,
    team: UpdateTeamRequest,
  ): Promise<TeamSuccessResponse> {
    // 更新対象を取得
    const updateTeam = await this.findOne(id);

    // 更新する値を設定 => 値がない場合は既存の値をそのまま残す
    updateTeam.team_name = team.team_name ?? updateTeam.team_name;
    updateTeam.penalty = team.penalty ?? updateTeam.penalty;
    this.teamRepository.save(updateTeam);
    return { id, message: 'update success' };
  }
}
