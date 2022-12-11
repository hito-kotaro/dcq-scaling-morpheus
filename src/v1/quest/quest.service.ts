import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quests } from 'src/entity/quest.entity';
import { Repository } from 'typeorm';
import { RequestService } from '../request/request.service';
import { UserService } from '../user/user.service';
import {
  CreateQuestRequest,
  QuestResponse,
  UpdateQuestRequest,
} from './dto/quest.dto';

@Injectable()
export class QuestService {
  constructor(
    @Inject(forwardRef(() => RequestService))
    private readonly requestService: RequestService,
    private readonly userService: UserService,
    @InjectRepository(Quests)
    private questRepository: Repository<Quests>,
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

  async findAll(): Promise<Quests[]> {
    return await this.questRepository.find({
      relations: ['owner'],
    });
  }

  // findOne
  async findOneById(id: number): Promise<Quests> {
    return await this.questRepository.findOne({
      relations: ['owner'],
      where: { id },
    });
  }

  async findOneByTitle(title: string): Promise<Quests> {
    return await this.questRepository.findOne({
      relations: ['owner'],
      where: { title },
    });
  }

  // クエスト作成
  async create(
    createQuest: CreateQuestRequest,
    owner_id: number,
  ): Promise<Quests> {
    const { title, description, example, reward } = createQuest;

    // 関連エンティティーの取得
    const owner = await this.userService.findOneById(owner_id);

    return await this.questRepository.save({
      owner,
      title,
      description,
      example,
      reward,
      status: true,
    });
  }

  async update(id: number, updateQuest: UpdateQuestRequest): Promise<Quests> {
    const { title, description, example, reward, status } = updateQuest;

    // 対象のクエストを取得
    const targetQuest = await this.findOneById(id);
    targetQuest.title = title ?? targetQuest.title;
    targetQuest.description = description ?? targetQuest.description;
    targetQuest.example = example ?? targetQuest.example;
    targetQuest.reward = reward ?? targetQuest.reward;
    targetQuest.status = status ?? targetQuest.status;
    return this.questRepository.save(targetQuest);
  }

  async delete(id: number) {
    // 紐づいているrequestを削除
    await this.requestService.delete(id);
    const targetQuests = await this.findOneById(id);
    return this.questRepository.remove(targetQuests);
  }
}
