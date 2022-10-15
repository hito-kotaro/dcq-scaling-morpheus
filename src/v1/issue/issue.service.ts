import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Issues } from 'src/entity/issue.entity';
import { Repository } from 'typeorm';
import { PenaltyService } from '../penalty/penalty.service';
import { TeamService } from '../team/team.service';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import {
  CreateIssueDto,
  DeleteIssueDto,
  FindAllIssueResponse,
  FindOneIssueResonse,
  IssueSuccessResponse,
} from './dto/issue.dto';

@Injectable()
export class IssueService {
  constructor(
    private readonly teamService: TeamService,
    private readonly tenantService: TenantService,
    private readonly userService: UserService,
    private readonly penaltyService: PenaltyService,
    @InjectRepository(Issues) private issueRepository: Repository<Issues>,
  ) {}

  async findOne(id: number): Promise<FindOneIssueResonse> {
    const issue = await this.issueRepository.findOne({
      relations: ['tenant', 'authorizer', 'team', 'penalty'],
      where: { id },
    });
    if (!issue) {
      throw new NotFoundException('issue could not found');
    }

    return issue;
  }

  async findAll(tenantId: number): Promise<FindAllIssueResponse> {
    const issues = await this.issueRepository.find({
      relations: ['tenant', 'authorizer', 'team', 'penalty'],
      where: { tenant: { id: tenantId } },
    });

    return { issues, total: issues.length };
  }

  async create(createIssue: CreateIssueDto): Promise<IssueSuccessResponse> {
    const { title, comment, tenant_id, team_id, authorizer_id, penalty_id } =
      createIssue;
    const tenant = await this.tenantService.findOneById(tenant_id);
    const team = await this.teamService.findOne(team_id);
    const authorizer = await this.userService.findOneById(authorizer_id);
    const penalty = await this.penaltyService.findOneById(penalty_id);

    const createdIssue = await this.issueRepository.save({
      title,
      comment,
      tenant,
      team,
      authorizer,
      penalty,
    });

    return { id: createdIssue.id, message: 'create success' };
  }

  async delete(id: number): Promise<IssueSuccessResponse> {
    await this.issueRepository.delete({ id });

    return { id, message: 'delete success' };
  }
}
