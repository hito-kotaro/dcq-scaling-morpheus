import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Penalties } from 'src/entity/penalty.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import {
  CreatePenaltyRequest,
  PenaltyResponse,
  UpdatePenaltyRequest,
} from './dto/penalty.dto';

@Injectable()
export class PenaltyService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Penalties)
    private penaltyRepository: Repository<Penalties>,
  ) {}

  fmtResponse(penalty: Penalties) {
    const response: PenaltyResponse = {
      id: penalty.id,
      title: penalty.title,
      description: penalty.description,
      point: penalty.point,
      owner: penalty.owner.name,
      owner_id: penalty.owner.id,
      created_at: penalty.created_at,
      updated_at: penalty.updated_at,
    };

    return response;
  }

  async findAll(): Promise<Penalties[]> {
    return await this.penaltyRepository.find({
      relations: ['owner'],
    });
  }

  async findOneById(id: number): Promise<Penalties> {
    return await this.penaltyRepository.findOne({
      relations: ['owner'],
      where: { id },
    });
  }

  async findOneByTitle(title: string): Promise<Penalties> {
    return await this.penaltyRepository.findOne({
      relations: ['owner'],
      where: { title },
    });
  }

  async create(
    owner_id: number,
    createPenalty: CreatePenaltyRequest,
  ): Promise<Penalties> {
    const { title, description, point } = createPenalty;

    // 関連エンティティの取得
    const owner = await this.userService.findOneById(owner_id);

    return await this.penaltyRepository.save({
      owner,
      title,
      description,
      point,
    });
  }

  async update(
    id: number,
    updatePenalty: UpdatePenaltyRequest,
  ): Promise<Penalties> {
    const { title, description, point } = updatePenalty;
    const targetPenalty = await this.findOneById(id);
    targetPenalty.title = title ?? targetPenalty.title;
    targetPenalty.description = description ?? targetPenalty.description;
    targetPenalty.point = point ?? targetPenalty.point;
    return this.penaltyRepository.save(targetPenalty);
  }
}
