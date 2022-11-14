import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teams } from 'src/entity/team.entity';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { TenantService } from '../tenant/tenant.service';
import {
  CreateTeamRequest,
  TeamResponse,
  UpdateTeamRequest,
} from './dto/team.dto';

@Injectable()
export class TeamService {
  constructor(
    private readonly tenantService: TenantService,
    @InjectRepository(Teams) private teamRepository: Repository<Teams>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  // チームフォーマット
  async fmtResponse(team: Teams): Promise<TeamResponse> {
    // memner数集計
    const users: Users[] = await this.userRepository.find({
      relations: ['team', 'tenant'],
      where: { team: { id: team.id } },
    });

    // point数集計
    let point = 0;
    users.map((u: Users) => (point = point + u.point));

    // responseを作って返す
    const response: TeamResponse = {
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
  async findOneById(id: number): Promise<Teams> {
    if (id <= 0) {
      throw new BadRequestException('id must be a positive integer');
    }

    return await this.teamRepository.findOne({
      relations: ['tenant'],
      where: { id },
    });
  }

  //チーム名検索
  async findOneByName(name: string): Promise<Teams> {
    return await this.teamRepository.findOne({
      relations: ['tenant'],
      where: { name },
    });
  }

  //テナント内チーム取得
  async findAllByTenantId(tenantId: number): Promise<Teams[]> {
    const teams = await this.teamRepository.find({
      relations: ['tenant'],
      where: { tenant: { id: tenantId } },
    });

    return teams;
  }

  // チーム作成
  async create(team: CreateTeamRequest): Promise<Teams> {
    // 対象のテナントを取得
    const tenant = await this.tenantService.findOneById(team.tenant_id);

    const createdTeam = await this.teamRepository.save({
      name: team.name,
      tenant: tenant,
    });

    return createdTeam;
  }

  // チーム更新
  // 更新可能なパラメータ:penalty, name
  async update(id: number, team: UpdateTeamRequest): Promise<Teams> {
    // 更新対象を取得
    const updateTeam = await this.findOneById(id);

    // 更新する値を設定 => 値がない場合は既存の値をそのまま残す
    updateTeam.name = team.name ?? updateTeam.name;
    updateTeam.penalty = team.penalty ?? updateTeam.penalty;
    this.teamRepository.save(updateTeam);
    return updateTeam;
  }
}
