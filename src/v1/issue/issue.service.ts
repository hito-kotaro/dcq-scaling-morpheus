import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Issues } from 'src/entity/issue.entity';
import { Repository } from 'typeorm';
import { PenaltyService } from '../penalty/penalty.service';
import { TeamService } from '../team/team.service';
import { UserService } from '../user/user.service';
import { CreateIssueRequest, IssueResponse } from './dto/issue.dto';

@Injectable()
export class IssueService {
  constructor(
    private readonly teamService: TeamService,
    private readonly userService: UserService,
    private readonly penaltyService: PenaltyService,
    @InjectRepository(Issues) private issueRepository: Repository<Issues>,
  ) {}

  fmtResponse(issue: Issues): IssueResponse {
    const response: IssueResponse = {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      point: issue.penalty.point,
      authorizer: issue.authorizer.name,
      team_id: issue.team.id,
      team: issue.team.name,
      penalty_title: issue.penalty.title,
      penalty_description: issue.penalty.description,
      penalty_updated_at: issue.penalty.updated_at,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };

    return response;
  }

  async findAll(): Promise<Issues[]> {
    return await this.issueRepository.find({
      relations: ['authorizer', 'team', 'penalty'],
    });
  }

  async create(
    authorizer_id: number,
    createIssue: CreateIssueRequest,
  ): Promise<Issues> {
    const { title, description, team_id, penalty_id } = createIssue;

    // 関連エンティティの取得
    const team = await this.teamService.findOneById(team_id);
    const authorizer = await this.userService.findOneById(authorizer_id);
    const penalty = await this.penaltyService.findOneById(penalty_id);

    return await this.issueRepository.save({
      title,
      description,
      team,
      authorizer,
      penalty,
    });
  }
}
