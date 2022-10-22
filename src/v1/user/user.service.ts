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
  UserResponse,
  UsersResponse,
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

  async findMemberByTeamId(teamId: number): Promise<UsersResponse> {
    const response = await this.userRepository.find({
      relations: ['role', 'team'],
      where: { team: { id: teamId } },
    });

    const users: UserResponse[] = response.map((u: Users) => {
      const response: UserResponse = {
        id: u.id,
        name: u.name,
        role_id: u.role.id,
        role: u.role.name,
        team_id: u.team.id,
        team: u.team.name,
        point: u.point,
      };
      return response;
    });

    return { users, total: users.length };
  }

  async findAllByTenantId(tenantId: number): Promise<UsersResponse> {
    const response = await this.userRepository.find({
      relations: ['role', 'team'],
      where: { tenant: { id: tenantId } },
    });

    const users: UserResponse[] = response.map((u: Users) => {
      const response: UserResponse = {
        id: u.id,
        name: u.name,
        role_id: u.role.id,
        role: u.role.name,
        team_id: u.team.id,
        team: u.team.name,
        point: u.point,
      };
      return response;
    });

    return { users, total: users.length };
  }

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
      where: { name: userName, tenant: { id: tenantId } },
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
      where: { name: userName, tenant: { name: tenantName } },
      // where: { user_name: userName },
    });
    if (!user) {
      throw new NotFoundException('could not found user');
    }
    return user;
  }

  async create(createUser: CreateUserRequest): Promise<UserSuccessResponse> {
    const { role_id, tenant_id, team_id, name, password } = createUser;

    const isExist = await this.userRepository.findOne({
      where: {
        name,
        tenant: { id: tenant_id },
      },
    });

    if (isExist) {
      throw new BadRequestException(`${name} already exist`);
    }

    // tenant取得
    const tenant = await this.tenantService.findOneById(tenant_id);
    const team = await this.teamService.findOne(team_id);
    const role = await this.roleService.findOne(role_id);

    const createdUser = await this.userRepository.save({
      tenant,
      team,
      role,
      name,
      password: await bcrypt.hash(password, 12),
      point: 0,
    });

    return { id: createdUser.id, message: 'create success' };
  }

  async update(
    user_id: number,
    user: UpdateUserRequest,
  ): Promise<UserSuccessResponse> {
    const { name, team_id, role_id, add_point } = user;
    const updateUser = await this.findOneById(user_id);

    // チーム、ロールの変更先を取得
    let role;
    let team;
    if (team_id) {
      team = await this.teamService.findOne(team_id);
    }
    if (role_id) {
      role = await this.roleService.findOne(role_id);
    }

    updateUser.team = team ?? updateUser.team;
    updateUser.role = role ?? updateUser.role;
    updateUser.name = name ?? updateUser.name;
    updateUser.point = updateUser.point + (add_point ?? 0);
    this.userRepository.save(updateUser);

    return { id: user_id, message: 'update success' };
  }
}
