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
  // 引数のテナント名が存在すればtrue/しなければfalseを返す。
  // 各メソッドで存在チェックをするためfindOneからは分離
  async idExists(id: number) {
    const tenant: Tenants = await this.tenantRepository.findOne({
      where: { id },
    });

    if (!tenant) {
      return false;
    } else {
      return true;
    }
  }

  async findLoginTenant(tenantName: string) {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_name: tenantName },
    });
    console.log(tenant);
    if (!tenant) {
      throw new NotFoundException('could not found user');
    }
    return tenant;
  }

  // 引数のテナント名が存在すればtrue/しなければfalseを返す。
  // 各メソッドで存在チェックをするためfindOneからは分離
  async nameExists(tenant_name: string) {
    const tenant: Tenants = await this.tenantRepository.findOne({
      where: { tenant_name },
    });

    if (!tenant) {
      return false;
    } else {
      return true;
    }
  }

  // idを渡してtenant情報を返す -> 名前がuniqなのでtenantNameで検索にしたい
  async findOneById(
    tenantId: number,
    isPassword?: boolean,
  ): Promise<GetOneTenantResponse> {
    // 存在チェックとデータ取得で2回クエリが実行されるがここは割り切り
    // if ((await this.idExists(id)) === false) {
    //   throw new NotFoundException('tenant could not found');
    // }

    const tenant: Tenants = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('could not found tenant');
    }

    const password = isPassword ? tenant.password : '';

    return {
      id: tenant.id,
      tenantName: tenant.tenant_name,
      password: password,
      seasonId: tenant.season_id,
      slackToken: tenant.slack_token,
      createdAt: tenant.created_at,
      updatedAt: tenant.updated_at,
    };
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

    return {
      id: tenant.id,
      tenantName: tenant.tenant_name,
      password: password,
      seasonId: tenant.season_id,
      slackToken: tenant.slack_token,
      createdAt: tenant.created_at,
      updatedAt: tenant.updated_at,
    };
  }

  async create(tenant: CreateTenantRequest): Promise<TenantSuccessResponse> {
    const existTenant = await this.nameExists(tenant.tenantName);
    // 同名のテナントが存在していたらエラーを投げる
    if (existTenant === true) {
      throw new BadRequestException('tenant already exist');
    }

    const createdTenant = await this.tenantRepository.save({
      tenant_name: tenant.tenantName,
      password: await bcrypt.hash(tenant.password, 12),
    });

    return { tenantId: createdTenant.id, message: 'create success' };
  }

  async update(
    id: number,
    tenant: UpdateTenantRequest,
  ): Promise<TenantSuccessResponse> {
    // 対象を探す -> 対象がなければfindOne内でエラーを投げる
    const updateTenant = await this.findOneById(id);

    // 更新する値を設定 -> 値がない場合は既存の値をそのまま残す
    updateTenant.password = tenant.password ?? updateTenant.password;
    updateTenant.seasonId = tenant.seasonId ?? updateTenant.seasonId;
    updateTenant.slackToken = tenant.slackToken ?? updateTenant.slackToken;
    this.tenantRepository.save(updateTenant);

    return { tenantId: updateTenant.id, message: 'update success' };
  }
}
