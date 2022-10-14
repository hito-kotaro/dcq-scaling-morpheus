import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Requests } from 'src/entity/request.entity';
import { Repository } from 'typeorm';
import { QuestService } from '../quest/quest.service';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import { CreateRequestDto, UpdateRequestDto } from './dto/request.dto';

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

  async findOne(id: number) {
    const isExist = await this.requestExist(id);

    if (isExist === false) {
      throw new NotFoundException('request could not found');
    }

    const request = await this.requestRepository.findOne({
      relations: ['quest'],
      where: { id },
    });

    return request;
  }

  async findAll(tenantId: number) {
    const requests = await this.requestRepository.find({
      relations: ['quest'],
      where: { tenant: { id: tenantId } },
    });
    return { requests, total: requests.length };
  }

  async create(createRequest: CreateRequestDto) {
    const { title, description, quest_id, applicant_id, tenant_id } =
      createRequest;
    // fixMe: appilcant -> applicant
    const appilcant = await this.userService.findOneById(applicant_id);
    const quest = await this.questService.findOne(quest_id);
    const tenant = await this.tenantService.findOneById(tenant_id);
    const createdRequest = await this.requestRepository.save({
      title,
      description,
      quest,
      // fixMe: appilcant -> applicant
      appilcant,
      tenant,
      status: 'open',
    });

    return { id: createdRequest.id, message: 'create success' };
  }

  async update(updateRequest: UpdateRequestDto) {
    const { id, updatedStatus } = updateRequest;
    console.log(updatedStatus);
    //ターゲットを取得
    const targetRequest = await this.findOne(id);
    console.log(targetRequest);
    targetRequest.status = updatedStatus;
    this.requestRepository.save(targetRequest);
    return { id: targetRequest.id, message: 'update success' };
  }
}
