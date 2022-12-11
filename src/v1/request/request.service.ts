import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Requests } from 'src/entity/request.entity';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { QuestService } from '../quest/quest.service';
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
    @Inject(forwardRef(() => QuestService))
    private readonly questService: QuestService,
    @InjectRepository(Requests)
    private requestRepository: Repository<Requests>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
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

  async findAll(): Promise<Requests[]> {
    return await this.requestRepository.find({
      relations: ['quest', 'applicant', 'authorizer'],
    });
  }

  async create(
    applicant_id,
    createRequest: CreateRequestRequest,
  ): Promise<Requests> {
    const { title, description, quest_id } = createRequest;
    console.log('--- create request ---');
    // 関連エンティティの取得
    const applicant = await this.userService.findOneById(applicant_id);
    const quest = await this.questService.findOneById(quest_id);
    return await this.requestRepository.save({
      title,
      description,
      quest,
      applicant,
      status: 'open',
    });
  }

  async update(
    id: number,
    authorizer_id: number,
    updateRequest: UpdateRequestRequest,
  ): Promise<Requests> {
    // console.log(updateRequest);
    // console.log(authorizer_id);
    console.log(`authorizer_id : ${authorizer_id}`);
    //ターゲットを取得
    const targetRequest = await this.findOneById(id);
    const authorizer = await this.userService.findOneById(authorizer_id);
    targetRequest.status = updateRequest.status;
    targetRequest.auth_comment = updateRequest.auth_comment;
    targetRequest.authorizer = authorizer;

    if (updateRequest.status === 'approved') {
      //  付与するユーザを取得
      const user = targetRequest.applicant;
      // ユーザとチームにポイントを付与
      const point = targetRequest.quest.reward;
      user.point = user.point + point;
      this.userRepository.save(user);
    }

    return this.requestRepository.save(targetRequest);
  }

  async delete(questId: number) {
    console.log('klokokokoko');
    const requests: Requests[] = await this.requestRepository.find({
      relations: ['quest'],
      where: { quest: { id: questId } },
    });

    return this.requestRepository.remove(requests);
  }
}
