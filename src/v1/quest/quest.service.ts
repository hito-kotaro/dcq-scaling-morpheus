import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quests } from 'src/entity/quest.entity';
import { Repository } from 'typeorm';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import {
  CreateQuestDto,
  FindAllQuestResponse,
  FindOneQuestResponse,
  QuestSuccessResponse,
  UpdateQuestDto,
} from './dto/quest.dto';

@Injectable()
export class QuestService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly userService: UserService,
    @InjectRepository(Quests) private questRepository: Repository<Quests>,
  ) {}

  // findOne
  async findOne(id: number): Promise<FindOneQuestResponse> {
    const quest = await this.questRepository.findOne({
      relations: ['tenant', 'owner'],
      where: { id },
    });
    if (!quest) {
      throw new NotFoundException('quest could not found');
    }

    return quest;
  }

  async findAll(tenantId: number): Promise<FindAllQuestResponse> {
    const quests = await this.questRepository.find({
      relations: ['tenant', 'owner'],
      where: { tenant: { id: tenantId } },
    });
    const response = {
      quests,
      total: quests.length,
    };
    return response;
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
  async create(createQuest: CreateQuestDto): Promise<QuestSuccessResponse> {
    const { tenant_id, owner_id, title, description, example, reward } =
      createQuest;
    const isExist = await this.titleExist(tenant_id, title);

    if (isExist === true) {
      throw new BadRequestException(`${title} is already exist`);
    }

    // テナント取得
    const tenant = await this.tenantService.findOneById(tenant_id);
    // ユーザ取得(クエストオーナー)
    const owner = await this.userService.findOne(owner_id);

    const createdQuest = await this.questRepository.save({
      tenant,
      owner,
      title,
      description,
      example,
      reward,
      status: true,
    });

    return { id: createdQuest.id, message: 'create success' };
  }

  async update(updateQuest: UpdateQuestDto): Promise<QuestSuccessResponse> {
    const {
      id,
      updated_title,
      updated_description,
      updated_example,
      updated_reward,
      updated_status,
    } = updateQuest;

    // 対象のクエストを取得
    const targetQuest = await this.findOne(id);

    targetQuest.title = updated_title ?? targetQuest.title;
    targetQuest.description = updated_description ?? targetQuest.description;
    targetQuest.example = updated_example ?? targetQuest.example;
    targetQuest.reward = updated_reward ?? targetQuest.reward;
    targetQuest.status = updated_status ?? targetQuest.status;
    this.questRepository.save(targetQuest);
    return { id, message: 'update success' };
  }
}
