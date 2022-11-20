import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Requests } from 'src/entity/request.entity';
import { Teams } from 'src/entity/team.entity';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { QuestService } from '../quest/quest.service';
import { TeamService } from '../team/team.service';
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
    private readonly teamService: TeamService,
    @InjectRepository(Requests) private requestRepository: Repository<Requests>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Teams) private teamRepository: Repository<Teams>,
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
    console.log(applicant_id);
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
    console.log(updateRequest);
    //ターゲットを取得
    const targetRequest = await this.findOneById(id);
    const authorizer = await this.userService.findOneById(authorizer_id);
    const applicant = await this.userService.findOneById(
      targetRequest.applicant.id,
    );
    targetRequest.status = updateRequest.status;
    targetRequest.auth_comment = updateRequest.auth_comment;
    targetRequest.authorizer = authorizer;

    if (updateRequest.status === 'approved') {
      //  付与するユーザを取得
      const user = targetRequest.applicant;
      const team = await this.teamService.findOneById(applicant.team.id);
      // ユーザとチームにポイントを付与
      const point = targetRequest.quest.reward;
      user.point = user.point + point;
      team.point = team.point + point;
      this.userRepository.save(user);
      this.teamRepository.save(team);
    }

    return this.requestRepository.save(targetRequest);
  }
}
