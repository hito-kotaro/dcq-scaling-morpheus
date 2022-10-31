import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Requests } from 'src/entity/request.entity';
import { Repository } from 'typeorm';
import { QuestService } from '../quest/quest.service';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import {
  CreateRequestRequest,
  RequestDataResponse,
  UpdateRequestRequest,
} from './dto/request.dto';

@Injectable()
export class RequestService {
  constructor(
    private readonly userService: UserService,
    private readonly questService: QuestService,
    private readonly tenantService: TenantService,
    @InjectRepository(Requests) private requestRepository: Repository<Requests>,
  ) {}

  fmtResponse(request: Requests): RequestDataResponse {
    const response: RequestDataResponse = {
      id: request.id,
      title: request.title,
      description: request.description,
      applicant: request.applicant.name,
      quest_title: request.quest.title,
      quest_description: request.quest.description,
      reward: request.quest.reward,
      status: request.status,
      auth_comment: request.auth_comment ?? '',
      authorizer: request.authorizer ? request.authorizer.name : '',
      created_at: request.created_at,
      updated_at: request.updated_at,
    };

    return response;
  }

  async findOneById(id: number): Promise<Requests> {
    return await this.requestRepository.findOne({
      relations: ['quest', 'applicant'],
      where: { id },
    });
  }

  async findAllByTenantId(tenantId: number): Promise<Requests[]> {
    return await this.requestRepository.find({
      relations: ['quest', 'applicant', 'authorizer'],
      where: { tenant: { id: tenantId } },
    });
  }

  async create(
    tenant_id: number,
    createRequest: CreateRequestRequest,
  ): Promise<Requests> {
    const { title, description, quest_id, applicant_id } = createRequest;
    // 関連エンティティの取得
    const applicant = await this.userService.findOneById(applicant_id);
    const quest = await this.questService.findOneById(quest_id);
    const tenant = await this.tenantService.findOneById(tenant_id);
    return await this.requestRepository.save({
      title,
      description,
      quest,
      applicant,
      tenant,
      status: 'open',
    });
  }

  async update(
    id: number,
    authorizer_id: number,
    updateRequest: UpdateRequestRequest,
  ): Promise<Requests> {
    console.log(authorizer_id);
    //ターゲットを取得
    const targetRequest = await this.findOneById(id);
    const authorizer = await this.userService.findOneById(authorizer_id);
    targetRequest.status = updateRequest.status;
    targetRequest.auth_comment = updateRequest.auth_comment;
    targetRequest.authorizer = authorizer;

    return this.requestRepository.save(targetRequest);
  }
}
