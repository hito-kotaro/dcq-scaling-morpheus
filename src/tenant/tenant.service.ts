import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenants } from 'src/entity/tenant.entity';
import { Repository } from 'typeorm';
import {
  CreateTenantDto,
  CreateTenantResponse,
  GetOneTenantResponse,
} from './dto/tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenants) private tenantRepository: Repository<Tenants>,
  ) {}

  async findOne(id: number): Promise<GetOneTenantResponse> {
    const tenant: Tenants = await this.tenantRepository.findOne({
      where: { id },
    });

    return {
      id: tenant.id,
      tenantName: tenant.tenant_name,
      season: tenant.season,
      slack: tenant.slack,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    };
  }

  async create(tenant: CreateTenantDto): Promise<CreateTenantResponse> {
    const createdTenant = await this.tenantRepository.save({
      tenant_name: tenant.tenantName,
      password: tenant.password,
    });

    return { tenantId: createdTenant.id };
  }
}
