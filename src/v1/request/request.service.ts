import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Requests } from 'src/entity/request.entity';
import { Repository } from 'typeorm';
import { QuestService } from '../quest/quest.service';
import { UserService } from '../user/user.service';
import { CreateRequestDto } from './dto/request.dto';

@Injectable()
export class RequestService {
  constructor(
    private readonly userService: UserService,
    private readonly questService: QuestService,
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
    console.log(id);
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
      where: { tenant: { id: tenantId } },
    });
    console.log(requests);
    return { requests, total: requests.length };
  }
  async create(createRequest: CreateRequestDto) {
    // import済み
    // 申請者
    // クエスト取得
  }
}
