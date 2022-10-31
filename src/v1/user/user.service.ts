import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { TeamService } from '../team/team.service';
import { TenantService } from '../tenant/tenant.service';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
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

  fmtResponse(user: Users): UserResponse {
    const response: UserResponse = {
      id: user.id,
      name: user.name,
      role_id: user.role.id,
      role: user.role.name,
      team_id: user.team.id,
      team: user.team.name,
      point: user.point,
    };

    return response;
  }

  // 指定チームのユーザ取得
  async findAllByTeamId(teamId: number): Promise<Users[]> {
    return await this.userRepository.find({
      relations: ['role', 'team'],
      where: { team: { id: teamId } },
    });
  }

  // 指定テナントのユーザ取得
  async findAllByTenantId(tenantId: number): Promise<Users[]> {
    return await this.userRepository.find({
      relations: ['role', 'team'],
      where: { tenant: { id: tenantId } },
    });
  }

  // 指定Idのユーザ取得
  async findOneById(id: number): Promise<Users> {
    return await this.userRepository.findOne({
      relations: ['role', 'team', 'tenant'],
      where: { id },
    });
  }

  // 指定テナントID内の指定のユーザ名を取得
  async findOneByNameAndTenatnId(
    userName: string,
    tenantId: number,
  ): Promise<Users> {
    return await this.userRepository.findOne({
      relations: ['role', 'team', 'tenant'],
      where: { name: userName, tenant: { id: tenantId } },
    });
  }

  //  指定テナント名内の指定ユーザ名を取得
  async findOneByNameAndTenatnName(userName: string, tenantName: string) {
    return await this.userRepository.findOne({
      relations: ['tenant'],
      where: { name: userName, tenant: { name: tenantName } },
    });
  }

  async create(createUser: CreateUserRequest): Promise<Users> {
    const { role_id, tenant_id, team_id, name, password } = createUser;

    // 関連エンティティの取得
    const tenant = await this.tenantService.findOneById(tenant_id);
    const team = await this.teamService.findOneById(team_id);
    const role = await this.roleService.findOne(role_id);

    return await this.userRepository.save({
      tenant,
      team,
      role,
      name,
      password: await bcrypt.hash(password, 12),
      point: 0,
    });
  }

  async update(user: UpdateUserRequest): Promise<Users> {
    const { name, team_id, role_id, add_point } = user;
    const updateUser = await this.findOneById(user.id);

    // チーム、ロールの変更先を取得
    let role;
    let team;
    if (team_id) {
      team = await this.teamService.findOneById(team_id);
    }
    if (role_id) {
      role = await this.roleService.findOne(role_id);
    }

    updateUser.team = team ?? updateUser.team;
    updateUser.role = role ?? updateUser.role;
    updateUser.name = name ?? updateUser.name;
    updateUser.point = updateUser.point + (add_point ?? 0);
    this.userRepository.save(updateUser);

    return updateUser;
  }
}
