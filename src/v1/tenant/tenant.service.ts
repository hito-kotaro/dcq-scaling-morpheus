import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenants } from 'src/entity/tenant.entity';
import { Repository } from 'typeorm';
import {
  CreateTenantRequest,
  TenantResponse,
  UpdateTenantRequest,
} from './dto/tenant.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TenantService {
  constructor(
    // private readonly teamService: TeamService,
    @InjectRepository(Tenants)
    private tenantRepository: Repository<Tenants>,
  ) {}

  fmtResponse(tenant: Tenants) {
    const response: TenantResponse = {
      id: tenant.id,
      name: tenant.name,
      season_id: tenant.season_id,
      slack_token: tenant.slack_token,
      created_at: tenant.created_at,
      updated_at: tenant.updated_at,
    };

    return response;
  }

  async validate(name: string) {
    const tenant = await this.tenantRepository.findOne({ where: { name } });
    return tenant;
  }

  // テナントID検索
  async findOneById(id: number): Promise<Tenants> {
    return await this.tenantRepository.findOne({
      where: { id },
    });
  }

  // テナント名検索(ログイン用)
  async findOneByName(name: string): Promise<Tenants> {
    return await this.tenantRepository.findOne({
      where: { name },
    });
  }

  // テナント作成
  async create(tenant: CreateTenantRequest): Promise<Tenants> {
    const newTenant = this.tenantRepository.create({
      name: tenant.name,
      password: await bcrypt.hash(tenant.password, 12),
    });

    return await this.tenantRepository.save(newTenant);
  }

  // テナント情報更新
  async update(id: number, tenant: UpdateTenantRequest): Promise<Tenants> {
    const updateTenant = await this.findOneById(id);

    updateTenant.password = tenant.password ?? updateTenant.password;
    updateTenant.season_id = tenant.season_id ?? updateTenant.season_id;
    updateTenant.slack_token = tenant.slack_token ?? updateTenant.slack_token;
    this.tenantRepository.save(updateTenant);

    return updateTenant;
  }
}
