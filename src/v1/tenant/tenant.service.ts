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

  async findOneByName(
    tenantName: string,
    isPassword?: boolean,
  ): Promise<FindOneTenantResponse> {
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

  async create(tenant: CreateTenantRequest): Promise<CreateTenantResponse> {
    const isExist: Tenants = await this.tenantRepository.findOne({
      where: { tenant_name: tenant.tenant_name },
    });

    if (isExist) {
      throw new BadRequestException(`${tenant.tenant_name} is already exist`);
    }

    const createdTenant = await this.tenantRepository.save({
      tenant_name: tenant.tenant_name,
      password: await bcrypt.hash(tenant.password, 12),
    });

    this.teamService.create({
      tenant_id: createdTenant.id,
      team_name: 'DefaultTeam',
    });

    return createdTenant;
  }

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
