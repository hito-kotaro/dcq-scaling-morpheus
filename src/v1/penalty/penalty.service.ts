import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Penalties } from 'src/entity/penalty.entity';
import { Repository } from 'typeorm';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import {
  CreatePenaltyRequest,
  FindAllPenaltyResponse,
  FindOnePenaltyResponse,
  PenaltySuccessResponse,
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

  async findOneById(id: number): Promise<FindOnePenaltyResponse> {
    const penalty = await this.penaltyRepository.findOne({
      relations: ['tenant', 'owner'],
      where: { id },
    });

    if (!penalty) {
      throw new NotFoundException('could not found penalty');
    }

    return penalty;
  }

  async findOneByName(penaltyTitle: string): Promise<FindOnePenaltyResponse> {
    const penalty = await this.penaltyRepository.findOne({
      relations: ['tenant', 'owner'],
      where: { title: penaltyTitle },
    });

    if (!penalty) {
      throw new NotFoundException('could not found penalty');
    }

    return penalty;
  }

  async findAll(tenantId: number): Promise<FindAllPenaltyResponse> {
    const penalties = await this.penaltyRepository.find({
      relations: ['tenant', 'owner'],
      where: { tenant: { id: tenantId } },
    });

    return { penalties, total: penalties.length };
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
    createPenalty: CreatePenaltyRequest,
  ): Promise<PenaltySuccessResponse> {
    const { title, description, penalty, tenant_id, owner_id } = createPenalty;
    const isExist = await this.titleExist(tenant_id, title);
    if (isExist === true) {
      throw new BadRequestException(`${title} is already exist`);
    }
    // テナント取得
    const tenant = await this.tenantService.findOneById(tenant_id);
    // ユーザ取得(クエストオーナー)
    const owner = await this.userService.findOneById(owner_id);

    const createdPenalty = await this.penaltyRepository.save({
      tenant,
      owner,
      title,
      description,
      penalty,
    });

    return { id: createdPenalty.id, message: 'create success' };
  }

  async update(
    updatePenalty: UpdatePenaltyRequest,
  ): Promise<PenaltySuccessResponse> {
    const { id, title, description, penalty } = updatePenalty;
    const targetPenalty = await this.findOneById(id);
    targetPenalty.title = title ?? targetPenalty.title;
    targetPenalty.description = description ?? targetPenalty.description;
    targetPenalty.penalty = penalty ?? targetPenalty.penalty;
    this.penaltyRepository.save(targetPenalty);
    return { id: targetPenalty.id, message: 'create success' };
  }
}
