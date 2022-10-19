import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenants } from 'src/entity/tenant.entity';
import { Repository } from 'typeorm';
import {
  CreateTenantRequest,
  CreateTenantResponse,
  FindOneTenantResponse,
  UpdateTenantRequest,
  UpdateTenantResponse,
} from './dto/tenant.dto';
import * as bcrypt from 'bcryptjs';
import { TeamService } from '../team/team.service';

@Injectable()
export class TenantService {
  constructor(
    // private readonly teamService: TeamService,
    @Inject(forwardRef(() => TeamService))
    private teamService: TeamService,
    @InjectRepository(Tenants) private tenantRepository: Repository<Tenants>,
  ) {}

  // テナントID検索
  async findOneById(
    tenantId: number,
    isPassword?: boolean,
  ): Promise<FindOneTenantResponse> {
    const tenant: Tenants = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('could not found tenant');
    }

    const password = isPassword ? tenant.password : '';
    tenant.password = password;
    return tenant;
  }

  // テナント名検索(ログイン用)
  async findOneByName(
    tenantName: string,
    isPassword?: boolean,
  ): Promise<FindOneTenantResponse> {
    const tenant: Tenants = await this.tenantRepository.findOne({
      where: { name: tenantName },
    });

    if (!tenant) {
      throw new NotFoundException('could not found tenant');
    }

    const password = isPassword ? tenant.password : '';
    tenant.password = password;
    return tenant;
  }

  // テナント作成
  async create(tenant: CreateTenantRequest): Promise<CreateTenantResponse> {
    const isExist: Tenants = await this.tenantRepository.findOne({
      where: { name: tenant.name },
    });
    console.log(tenant);
    if (isExist) {
      throw new BadRequestException(`${tenant.name} is already exist`);
    }

    const createdTenant = await this.tenantRepository.save({
      name: tenant.name,
      password: await bcrypt.hash(tenant.password, 12),
    });

    this.teamService.create({
      tenant_id: createdTenant.id,
      name: 'DefaultTeam',
    });

    return createdTenant;
  }

  // テナント情報更新
  async update(
    id: number,
    tenant: UpdateTenantRequest,
  ): Promise<UpdateTenantResponse> {
    const updateTenant = await this.findOneById(id);

    updateTenant.password = tenant.password ?? updateTenant.password;
    updateTenant.season_id = tenant.season_id ?? updateTenant.season_id;
    updateTenant.slack_token = tenant.slack_token ?? updateTenant.slack_token;
    this.tenantRepository.save(updateTenant);

    return updateTenant;
  }
}
