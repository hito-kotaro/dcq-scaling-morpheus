import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teams } from 'src/entity/team.entity';
import { Repository } from 'typeorm';
import { TenantService } from '../tenant/tenant.service';
import {
  CreateTeamDto,
  FindAllTeamResponse,
  FindOneTeamResponse,
  TeamEntity,
  TeamSuccessResponse,
  UpdateTeamDto,
} from './dto/team.dto';

// FixMe:Findの結果で外部キーのtenantIdが取得できない -> relationsオプションで取得
@Injectable()
export class TeamService {
  constructor(
    private readonly tenantService: TenantService,
    @InjectRepository(Teams) private teamRepository: Repository<Teams>,
  ) {}

  //特定チームの取得
  async findOne(id: number): Promise<FindOneTeamResponse> {
    console.log(id);
    if (!id) {
      throw new BadRequestException('team id is empty');
    }
    const team = await this.teamRepository.findOne({
      relations: ['tenant'],
      where: { id },
    });
    // 対象がない時
    if (!team) {
      throw new NotFoundException('team could not found');
    }

    const teamResponse: FindOneTeamResponse = {
      id: team.id,
      teamName: team.team_name,
      penalty: team.penalty,
      tenant: team.tenant,
    };

    return teamResponse;
  }

  //テナント内の全チーム取得
  async findAll(tenantId: number): Promise<FindAllTeamResponse> {
    console.log(tenantId);
    console.log('AAAAAAAA');
    const teams = await this.teamRepository.find({
      relations: ['tenant'],
      where: { tenant: { id: tenantId } },
    });

    // プロパティ名の変換
    const teamsResponse: FindOneTeamResponse[] = teams.map((t: TeamEntity) => {
      const teamResponse: FindOneTeamResponse = {
        id: t.id,
        teamName: t.team_name,
        penalty: t.penalty,
        tenant: t.tenant,
      };
      return teamResponse;
    });

    const response = {
      total: teamsResponse.length,
      teams: teamsResponse,
    };

    return response;
  }

  // チーム存在チェック
  async teamExist(team_name: string, tenant_id: number) {
    const team = await this.teamRepository.findOne({
      relations: ['tenant'],
      where: { team_name: team_name, tenant: { id: tenant_id } },
    });

    if (team) {
      return true;
    } else {
      return false;
    }
  }

  // チーム作成
  async create(team: CreateTeamDto): Promise<TeamSuccessResponse> {
    // 対象のテナントを取得
    const tenant = await this.tenantService.findOneById(team.tenantId);
    // テナント内に同名のチームが既に存在する場合エラーを投げる
    // fixMe: エラーを一括してハンドリングしたい(duplicate/外部キー)
    if ((await this.teamExist(team.teamName, team.tenantId)) === true) {
      throw new BadRequestException(`tenant ${team.teamName} is already exist`);
    }

    const createdTeam = await this.teamRepository.save({
      team_name: team.teamName,
      tenant: tenant,
    });

    return { id: createdTeam.id, message: 'create success' };
  }

  // チーム更新
  // 更新可能なパラメータ:penalty, name
  async update(id: number, team: UpdateTeamDto): Promise<TeamSuccessResponse> {
    // 更新対象を取得
    const updateTeam = await this.findOne(id);

    // 更新する値を設定 => 値がない場合は既存の値をそのまま残す
    updateTeam.teamName = team.teamName ?? updateTeam.teamName;
    updateTeam.penalty = team.penalty ?? updateTeam.penalty;
    this.teamRepository.save(updateTeam);
    return { id, message: 'update success' };
  }
}
