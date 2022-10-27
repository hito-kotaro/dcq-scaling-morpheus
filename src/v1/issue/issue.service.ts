import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Issues } from 'src/entity/issue.entity';
import { Repository } from 'typeorm';
import { PenaltyService } from '../penalty/penalty.service';
import { TeamService } from '../team/team.service';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import { CreateIssueRequest, IssueResponse } from './dto/issue.dto';

@Injectable()
export class IssueService {
  constructor(
    private readonly teamService: TeamService,
    private readonly tenantService: TenantService,
    private readonly userService: UserService,
    private readonly penaltyService: PenaltyService,
    @InjectRepository(Issues) private issueRepository: Repository<Issues>,
  ) {}

  //　存在チェック
  async IssueExist(title: string) {
    const issue = await this.issueRepository.findOne({ where: { title } });
    if (issue) {
      return true;
    } else {
      return false;
    }
  }

  fmtResponse(issue: Issues): IssueResponse {
    const response: IssueResponse = {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      authorizer: issue.authorizer.name,
      team_id: issue.team.id,
      team: issue.team.name,
      penalty_title: issue.penalty.title,
      penalty_description: issue.penalty.description,
    };

    return response;
  }

  async findOne(id: number): Promise<Issues> {
    const issue = await this.issueRepository.findOne({
      relations: ['tenant', 'authorizer', 'team', 'penalty'],
      where: { id },
    });

    return issue;
  }

  async findAll(tenantId: number): Promise<Issues[]> {
    const issues = await this.issueRepository.find({
      relations: ['tenant', 'authorizer', 'team', 'penalty'],
      where: { tenant: { id: tenantId } },
    });

    return issues;
  }

  async create(
    tenant_id: number,
    createIssue: CreateIssueRequest,
  ): Promise<Issues> {
    const { title, description, team_id, authorizer_id, penalty_id } =
      createIssue;
    const tenant = await this.tenantService.findOneById(tenant_id);
    const team = await this.teamService.findOne(team_id);
    const authorizer = await this.userService.findOneById(authorizer_id);
    const penalty = await this.penaltyService.findOneById(penalty_id);

    const createdIssue = await this.issueRepository.save({
      title,
      description,
      tenant,
      team,
      authorizer,
      penalty,
    });

    return createdIssue;
  }
}
