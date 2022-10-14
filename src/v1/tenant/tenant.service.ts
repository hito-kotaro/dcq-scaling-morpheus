import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenants } from 'src/entity/tenant.entity';
import { Repository } from 'typeorm';
import {
  CreateTenantRequest,
  GetOneTenantResponse,
  TenantSuccessResponse,
  UpdateTenantRequest,
} from './dto/tenant.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenants) private tenantRepository: Repository<Tenants>,
  ) {}

  async findOneById(
    tenantId: number,
    isPassword?: boolean,
  ): Promise<GetOneTenantResponse> {
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

  async findOneByName(
    tenantName: string,
    isPassword?: boolean,
  ): Promise<GetOneTenantResponse> {
    const tenant: Tenants = await this.tenantRepository.findOne({
      where: { tenant_name: tenantName },
    });

    if (!tenant) {
      throw new NotFoundException('could not found tenant');
    }

    const password = isPassword ? tenant.password : '';
    tenant.password = password;
    return tenant;
  }

  async create(tenant: CreateTenantRequest): Promise<TenantSuccessResponse> {
    const isExist = await this.findOneByName(tenant.tenant_name);

    if (isExist) {
      throw new BadRequestException(`${tenant.tenant_name} is already exist`);
    }

    const createdTenant = await this.tenantRepository.save({
      tenant_name: tenant.tenant_name,
      password: await bcrypt.hash(tenant.password, 12),
    });

    return { tenant_id: createdTenant.id, message: 'create success' };
  }

  async update(
    id: number,
    tenant: UpdateTenantRequest,
  ): Promise<TenantSuccessResponse> {
    // 対象を探す -> 対象がなければfindOne内でエラーを投げる
    const updateTenant = await this.findOneById(id);

    // 更新する値を設定 -> 値がない場合は既存の値をそのまま残す
    updateTenant.password = tenant.password ?? updateTenant.password;
    updateTenant.season_id = tenant.season_id ?? updateTenant.season_id;
    updateTenant.slack_token = tenant.slack_token ?? updateTenant.slack_token;
    this.tenantRepository.save(updateTenant);

    return { tenant_id: updateTenant.id, message: 'update success' };
  }
}
