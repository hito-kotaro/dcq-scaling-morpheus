import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lists } from 'src/entity/list.entity';
import { Repository } from 'typeorm';
import { AllListDataResponse } from './dto/list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(Lists) private requestRepository: Repository<Lists>,
  ) {}

  async findAll(): Promise<AllListDataResponse> {
    const lists: Lists[] = await this.requestRepository.find();
    return { lists, total: lists.length };
  }
}
