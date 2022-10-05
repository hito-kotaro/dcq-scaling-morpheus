import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenants } from 'src/entity/tenant.entity';
import { Repository } from 'typeorm';
import {
  CreateTenantDto,
  GetOneTenantResponse,
  TenantSuccessResponse,
  UpdateTenantDto,
} from './dto/tenant.dto';

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

  // idを渡してtenant情報を返す
  async findOne(id: number): Promise<GetOneTenantResponse> {
    // 存在チェックとデータ取得で2回クエリが実行されるがここは割り切り
    if ((await this.idExists(id)) === false) {
      throw new NotFoundException('tenant could not found');
    }

    const tenant: Tenants = await this.tenantRepository.findOne({
      where: { id },
    });

    return {
      id: tenant.id,
      tenant_name: tenant.tenant_name,
      password: tenant.password,
      season_id: tenant.season_id,
      slack_token: tenant.slack_token,
      created_at: tenant.created_at,
      updated_at: tenant.updated_at,
    };
  }

  async create(tenant: CreateTenantDto): Promise<TenantSuccessResponse> {
    const existTenant = await this.nameExists(tenant.tenant_name);
    console.log(tenant);
    // 同名のテナントが存在していたらエラーを投げる
    if (existTenant === true) {
      throw new BadRequestException('tenant already exist');
    }

    const createdTenant = await this.tenantRepository.save({
      tenant_name: tenant.tenant_name,
      password: tenant.password,
    });

    return { tenantId: createdTenant.id, message: 'create success' };
  }

  async update(
    id: number,
    tenant: UpdateTenantDto,
  ): Promise<TenantSuccessResponse> {
    // 対象を探す -> 対象がなければfindOne内でエラーを投げる
    const updateTenant = await this.findOne(id);

    // 更新する値を設定 -> 値がない場合は既存の値をそのまま残す
    updateTenant.password = tenant.password ?? updateTenant.password;
    updateTenant.season_id = tenant.season_id ?? updateTenant.season_id;
    updateTenant.slack_token = tenant.slack_token ?? updateTenant.slack_token;
    this.tenantRepository.save(updateTenant);

    return { tenantId: updateTenant.id, message: 'update success' };
  }
}
