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
    const team = await this.teamRepository.findOne({
      relations: ['tenant'],
      where: { id },
    });
    // 対象がない時
    if (!team) {
      throw new NotFoundException('team could not found');
    }
    return team;
  }

  //テナント内の全チーム取得
  async findAll(tenant_id: number): Promise<FindAllTeamResponse> {
    const teams = await this.teamRepository.find({
      relations: ['tenant'],
      where: { tenant: { id: tenant_id } },
    });
    const response = {
      total: teams.length,
      teams,
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
    const tenant = await this.tenantService.findOneById(team.tenant_id);
    // テナント内に同名のチームが既に存在する場合エラーを投げる
    // fixMe: エラーを一括してハンドリングしたい(duplicate/外部キー)
    if ((await this.teamExist(team.team_name, team.tenant_id)) === true) {
      throw new BadRequestException(
        `tenant ${team.team_name} is already exist`,
      );
    }

    const createdTeam = await this.teamRepository.save({
      team_name: team.team_name,
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
    updateTeam.team_name = team.team_name ?? updateTeam.team_name;
    updateTeam.penalty = team.penalty ?? updateTeam.penalty;
    this.teamRepository.save(updateTeam);
    return { id, message: 'update success' };
  }
}
