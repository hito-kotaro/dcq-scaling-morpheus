import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teams } from 'src/entity/team.entity';
import { Repository } from 'typeorm';
import {
  CreateTeamDto,
  FindAllTeamResponse,
  FindOneTeamResponse,
  TeamSuccessResponse,
  UpdateTeamDto,
} from './dto/team.dto';

// チーム取得
// チーム全取得
// チーム作成
// チーム更新
// チーム削除
// FixMe:Findの結果で外部キーのtenantIdが取得できない
@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Teams) private teamRepository: Repository<Teams>,
  ) {}

  //特定チームの取得
  async findOne(id: number): Promise<FindOneTeamResponse> {
    const team = await this.teamRepository.findOne({ where: { id } });
    // 対象がない時
    if (!team) {
      throw new NotFoundException('team could not found');
    }
    console.log(team);
    return team;
  }

  //全チームの取得
  async findAll(): Promise<FindAllTeamResponse> {
    const teams = await this.teamRepository.find();
    const response = {
      total: teams.length,
      teams,
    };
    return response;
  }

  // チーム作成
  async create(team: CreateTeamDto): Promise<TeamSuccessResponse> {
    await this.teamRepository.save({
      name: team.name,
      tenant: team.tenant,
    });

    return { teamId: 1, message: 'create success' };
  }

  // チーム更新
  // 更新可能なパラメータ
  //  penalty, name
  async update(id: number, team: UpdateTeamDto): Promise<TeamSuccessResponse> {
    // 更新対象を取得
    const updateTeam = await this.findOne(id);

    // 更新する値を設定 => 値がない場合は既存の値をそのまま残す
    updateTeam.name = team.name ?? updateTeam.name;
    updateTeam.penalty = team.penalty ?? updateTeam.penalty;
    this.teamRepository.save(updateTeam);

    return { teamId: id, message: 'update success' };
  }
}
