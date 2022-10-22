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
import { UsersResponse } from '../user/dto/user.dto';
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

  // チームフォーマット
  async formatTeamResponse(team: Teams): Promise<FindOneTeamResponse> {
    // memner数集計
    const users: Users[] = await this.userRepository.find({
      relations: ['role', 'team', 'tenant'],
      where: { team: { id: team.id } },
    });

    // point数集計
    let point = 0;
    users.map((u: Users) => (point = point + u.point));

    // responseを作って返す
    const response: FindOneTeamResponse = {
      id: team.id,
      name: team.name,
      member: users.length,
      point,
      penalty: team.penalty,
      tenant_id: team.tenant.id,
    };
    return response;
  }

  //チームID検索
  async findOne(id: number): Promise<FindOneTeamResponse> {
    if (!id) {
      throw new BadRequestException('team id is empty');
    }

    const team = await this.teamRepository.findOne({
      relations: ['tenant'],
      where: { id },
    });

    if (!team) {
      throw new NotFoundException('team could not found');
    }

    return await this.formatTeamResponse(team);
  }

  //テナント内チーム取得
  async findAll(tenantId: number): Promise<FindAllTeamResponse> {
    const teams = await this.teamRepository.find({
      relations: ['tenant'],
      where: { tenant: { id: tenantId } },
    });

    const teamList = [];

    // 全てのチームに対してFindOneで整形したレスポンスを返す
    const makeList = async () => {
      // eslint-disable-next-line prefer-const
      for (let t of teams) {
        teamList.push(await this.formatTeamResponse(t));
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
      where: { name: team.name, tenant: { id: team.tenant_id } },
    });

    if (isExist) {
      throw new BadRequestException(`${team.name} already exist`);
    }

    const createdTeam = await this.teamRepository.save({
      name: team.name,
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
    updateTeam.name = team.name ?? updateTeam.name;
    updateTeam.penalty = team.penalty ?? updateTeam.penalty;
    this.teamRepository.save(updateTeam);
    return { id, message: 'update success' };
  }
}
