import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teams } from 'src/entity/teams.entity';
import { Repository } from 'typeorm';
import {
  CreateTeamDto,
  FindAllTeamResponse,
  FindOneTeamResponse,
  TeamSuccessResponse,
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
}
