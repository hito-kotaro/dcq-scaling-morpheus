import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Penalties } from 'src/entity/penalty.entity';
import { Repository } from 'typeorm';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import {
  CreatePenaltyRequest,
  PenaltyResponse,
  UpdatePenaltyRequest,
} from './dto/penalty.dto';

@Injectable()
export class PenaltyService {
  constructor(
    private readonly tenantService: TenantService,
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

  async findOneById(id: number): Promise<Penalties> {
    const penalty = await this.penaltyRepository.findOne({
      relations: ['tenant', 'owner'],
      where: { id },
    });

    if (!penalty) {
      throw new NotFoundException('could not found penalty');
    }

    return penalty;
  }

  async findAll(tenantId: number): Promise<Penalties[]> {
    const penalties = await this.penaltyRepository.find({
      relations: ['tenant', 'owner'],
      where: { tenant: { id: tenantId } },
    });
    console.log(penalties);
    return penalties;
  }

  // テナント内同一タイトル重複チェック
  async titleExist(tenantId: number, title: string) {
    const penalty = await this.penaltyRepository.findOne({
      relations: ['tenant'],
      where: { title, tenant: { id: tenantId } },
    });

    if (penalty) {
      return true;
    } else {
      return false;
    }
  }

  async create(
    tenant_id: number,
    owner_id: number,
    createPenalty: CreatePenaltyRequest,
  ): Promise<Penalties> {
    const { title, description, point } = createPenalty;
    // テナント取得
    const tenant = await this.tenantService.findOneById(tenant_id);
    // ユーザ取得(クエストオーナー)
    const owner = await this.userService.findOneById(owner_id);

    const createdPenalty = await this.penaltyRepository.save({
      tenant,
      owner,
      title,
      description,
      point,
    });

    return createdPenalty;
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
    this.penaltyRepository.save(targetPenalty);
    return targetPenalty;
  }
}
