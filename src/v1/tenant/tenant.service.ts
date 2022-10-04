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
  async nameExists(tenantName: string) {
    const tenant: Tenants = await this.tenantRepository.findOne({
      where: { tenantName },
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
      tenantName: tenant.tenantName,
      password: tenant.password,
      seasonId: tenant.seasonId,
      slackId: tenant.slackId,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    };
  }

  async create(tenant: CreateTenantDto): Promise<TenantSuccessResponse> {
    const existTenant = await this.nameExists(tenant.tenantName);
    console.log(tenant);
    // 同名のテナントが存在していたらエラーを投げる
    if (existTenant === true) {
      throw new BadRequestException('tenant already exist');
    }

    const createdTenant = await this.tenantRepository.save({
      tenantName: tenant.tenantName,
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
    updateTenant.seasonId = tenant.seasonId ?? updateTenant.seasonId;
    updateTenant.slackId = tenant.slackId ?? updateTenant.slackId;
    this.tenantRepository.save(updateTenant);

    return { tenantId: updateTenant.id, message: 'update success' };
  }
}
