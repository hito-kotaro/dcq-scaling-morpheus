import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { TeamService } from '../team/team.service';
import { TenantService } from '../tenant/tenant.service';
import {
  CreateUserRequest,
  FindOneUserResponse,
  UpdateUserRequest,
  UserSuccessResponse,
} from './dto/user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly teamService: TeamService,
    private readonly roleService: RoleService,
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async findOneById(
    id: number,
    isPassword?: boolean,
  ): Promise<FindOneUserResponse> {
    const user: Users = await this.userRepository.findOne({
      relations: ['role', 'team', 'tenant'],
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('could not found user');
    }
    const password = isPassword ? user.password : '';
    user.password = password;

    return user;
  }

  async findOneByName(
    userName: string,
    tenantId: number,
    isPassword?: boolean,
  ): Promise<FindOneUserResponse> {
    const user: Users = await this.userRepository.findOne({
      relations: ['role', 'team', 'tenant'],
      where: { user_name: userName, tenant: { id: tenantId } },
    });

    if (!user) {
      throw new NotFoundException('could not found user');
    }
    const password = isPassword ? user.password : '';
    user.password = password;

    return user;
  }

  // fixMe: 同一テナント内に同姓同名がいるとログインで特定できないので、userServiceで絞る
  async findLoginUser(userName: string, tenantName: string) {
    const user = await this.userRepository.findOne({
      relations: ['tenant'],
      where: { user_name: userName, tenant: { tenant_name: tenantName } },
      // where: { user_name: userName },
    });
    console.log(user);
    if (!user) {
      throw new NotFoundException('could not found user');
    }
    return user;
  }

  async create(createUser: CreateUserRequest): Promise<UserSuccessResponse> {
    const { role_id, tenant_id, team_id, user_name, password, point } =
      createUser;

    const isExist = await this.userRepository.findOne({
      where: {
        user_name: createUser.user_name,
        tenant: { id: createUser.tenant_id },
      },
    });

    if (isExist) {
      throw new BadRequestException(`${createUser.user_name} already exist`);
    }

    // tenant取得
    const tenant = await this.tenantService.findOneById(tenant_id);
    const team = await this.teamService.findOne(team_id);
    const role = await this.roleService.findOne(role_id);

    const createdUser = await this.userRepository.save({
      tenant,
      team,
      role,
      user_name,
      password: await bcrypt.hash(password, 12),
      point,
    });

    return { id: createdUser.id, message: 'create success' };
  }

  async update(
    user_id: number,
    user: UpdateUserRequest,
  ): Promise<UserSuccessResponse> {
    const { updated_user_name, updated_team_id, updated_role_id, add_point } =
      user;
    const updateUser = await this.findOneById(user_id);

    // チーム、ロールの変更先を取得
    let role;
    let team;
    if (updated_team_id) {
      team = await this.teamService.findOne(updated_team_id);
    }
    if (updated_role_id) {
      role = await this.roleService.findOne(updated_role_id);
    }

    updateUser.team = team ?? updateUser.team;
    updateUser.role = role ?? updateUser.role;
    updateUser.user_name = updated_user_name ?? updateUser.user_name;
    updateUser.point = updateUser.point + (add_point ?? 0);
    this.userRepository.save(updateUser);

    return { id: user_id, message: 'update success' };
  }
}
