import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quests } from 'src/entity/quest.entity';
import { Repository } from 'typeorm';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import {
  CreateQuestRequest,
  QuestResponse,
  UpdateQuestRequest,
} from './dto/quest.dto';

@Injectable()
export class QuestService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly userService: UserService,
    @InjectRepository(Quests) private questRepository: Repository<Quests>,
  ) {}

  fmtResponse(quest: Quests) {
    const response: QuestResponse = {
      id: quest.id,
      title: quest.title,
      description: quest.description,
      example: quest.example,
      reward: quest.reward,
      owner: quest.owner.name,
      owner_id: quest.owner.id,
      date: quest.updated_at,
    };
    return response;
  }

  async findAll(tenantId: number): Promise<Quests[]> {
    const quests = await this.questRepository.find({
      relations: ['tenant', 'owner'],
      where: { tenant: { id: tenantId } },
    });

    return quests;
  }

  // テナント内同一タイトル重複チェック
  async titleExist(tenantId: number, title: string) {
    const quest = await this.questRepository.findOne({
      relations: ['tenant'],
      where: { title, tenant: { id: tenantId } },
    });

    if (quest) {
      return true;
    } else {
      return false;
    }
  }

  // クエスト作成
  async create(createQuest: CreateQuestRequest): Promise<Quests> {
    const { tenant_id, owner_id, title, description, example, reward } =
      createQuest;

    // テナント取得
    const tenant = await this.tenantService.findOneById(tenant_id);
    // ユーザ取得(クエストオーナー)
    const owner = await this.userService.findOneById(owner_id);

    const createdQuest = await this.questRepository.save({
      tenant,
      owner,
      title,
      description,
      example,
      reward,
      status: true,
    });

    // const response = this.formatResponse(createdQuest);

    return createdQuest;
  }

  // findOne
  async findOneById(id: number): Promise<Quests> {
    const quest = await this.questRepository.findOne({
      relations: ['tenant', 'owner'],
      where: { id },
    });
    if (!quest) {
      throw new NotFoundException('could not found quest');
    }
    return quest;
  }

  async update(updateQuest: UpdateQuestRequest): Promise<Quests> {
    const { id, title, description, example, reward, status } = updateQuest;

    // 対象のクエストを取得
    const targetQuest = await this.findOneById(id);
    targetQuest.title = title ?? targetQuest.title;
    targetQuest.description = description ?? targetQuest.description;
    targetQuest.example = example ?? targetQuest.example;
    targetQuest.reward = reward ?? targetQuest.reward;
    targetQuest.status = status ?? targetQuest.status;
    this.questRepository.save(targetQuest);
    return targetQuest;
  }
}
