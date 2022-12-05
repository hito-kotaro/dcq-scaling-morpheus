import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lists } from 'src/entity/list.entity';
import { Repository } from 'typeorm';
import {
  AllListDataResponse,
  CreateListtRequest,
  UpdateListRequest,
} from './dto/list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(Lists) private listRepository: Repository<Lists>,
  ) {}

  async findAll(): Promise<AllListDataResponse> {
    const lists: Lists[] = await this.listRepository.find();
    return { lists, total: lists.length };
  }

  async create(
    createList: CreateListtRequest,
    created_by: string,
  ): Promise<Lists> {
    return await this.listRepository.save({
      title: createList.title,
      description: createList.description,
      point: createList.point,
      created_by: created_by,
    });
  }

  async update(
    id: number,
    updateList: UpdateListRequest,
    created_by: string,
  ): Promise<Lists> {
    const { title, description, point } = updateList;
    // 更新対象を取得
    const list: Lists = await this.listRepository.findOne({
      where: { id },
    });

    // 更新
    list.title = title ?? list.title;
    list.description = description ?? list.description;
    list.point = point ?? list.point;
    list.created_by = created_by;

    return this.listRepository.save(list);
  }
}
