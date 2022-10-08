import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { TenantService } from '../tenant/tenant.service';
import {
  CreateUserDto,
  FindOneUserResponse,
  UserSuccessResponse,
} from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly tenantService: TenantService,
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  // 存在チェック
  async userExist(id: number): Promise<boolean> {
    const user: Users = await this.userRepository.findOne({
      relations: ['role', 'tenant'],
      where: { id },
    });

    if (user) {
      return true;
    } else {
      return false;
    }
  }

  // GetUser
  // パスワード以外のユーザ情報を返す
  async findOne(id: number): Promise<FindOneUserResponse> {
    const isExist = await this.userExist(id);

    if (isExist === false) {
      throw new NotFoundException('user could not found');
    }

    const user: Users = await this.userRepository.findOne({
      relations: ['role', 'tenant'],
      where: { id },
    });

    return {
      id: user.id,
      user_name: user.user_name,
      role: user.role,
      tenant: user.tenant,
      point: user.point,
    };
  }

  async create(createUser: CreateUserDto): Promise<UserSuccessResponse> {
    const { role_id, tenant_id, team_id, user_name, password } = createUser;
    // tenant取得
    const tenant = await this.tenantService.findOne(tenant_id);
    const createdUser = await this.userRepository.save({
      tenant,
      team_id,
      role_id,
      user_name,
      password,
    });

    return { id: createdUser.id, message: 'create success' };
  }
}
