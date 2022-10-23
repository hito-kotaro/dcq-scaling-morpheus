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

  // 存在チェック
  async requestExist(id: number) {
    const request = await this.requestRepository.findOne({ where: { id } });

    if (request) {
      return true;
    } else {
      return false;
    }
  }

  fmtResponse(request: Requests): RequestDataResponse {
    const response: RequestDataResponse = {
      id: request.id,
      title: request.title,
      description: request.description,
      applicant: request.applicant.name,
      quest_title: request.quest.title,
      quest_descriptio: request.quest.description,
      reward: request.quest.reward,
      status: request.status,
      date: request.created_at,
    };

    return response;
  }

  async findOneById(id: number): Promise<Requests> {
    const request = await this.requestRepository.findOne({
      relations: ['quest', 'applicant'],
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('could not found request');
    }

    return request;
  }

  async findAllByTenantId(tenantId: number): Promise<Requests[]> {
    const requests = await this.requestRepository.find({
      relations: ['quest', 'applicant'],
      where: { tenant: { id: tenantId } },
    });
    return requests;
  }

  async create(
    tenant_id: number,
    createRequest: CreateRequestRequest,
  ): Promise<Requests> {
    const { title, description, quest_id, applicant_id } = createRequest;
    const applicant = await this.userService.findOneById(applicant_id);
    const quest = await this.questService.findOneById(quest_id);
    const tenant = await this.tenantService.findOneById(tenant_id);
    const createdRequest = await this.requestRepository.save({
      title,
      description,
      quest,
      applicant,
      tenant,
      status: 'open',
    });

    return createdRequest;
  }

  async update(
    id: number,
    updateRequest: UpdateRequestRequest,
  ): Promise<Requests> {
    console.log(updateRequest);
    //ターゲットを取得
    const targetRequest = await this.findOneById(id);
    console.log(targetRequest);
    targetRequest.status = updateRequest.status;
    this.requestRepository.save(targetRequest);
    return targetRequest;
  }
}
