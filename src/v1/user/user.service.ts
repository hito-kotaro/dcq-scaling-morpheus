import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
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
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  fmtResponse(user: Users): UserResponse {
    const response: UserResponse = {
      id: user.id,
      name: user.name,
      team_id: user.team.id,
      team: user.team.name,
      point: user.point,
    };

    return response;
  }

  // 指定チームのユーザ取得
  async findAllByTeamId(teamId: number): Promise<Users[]> {
    return await this.userRepository.find({
      relations: ['team'],
      where: { team: { id: teamId } },
    });
  }

  // 指定テナントのユーザ取得
  async findAllByTenantId(tenantId: number): Promise<Users[]> {
    return await this.userRepository.find({
      relations: ['team'],
      where: { tenant: { id: tenantId } },
    });
  }

  // 指定Idのユーザ取得
  async findOneById(id: number): Promise<Users> {
    return await this.userRepository.findOne({
      relations: ['team', 'tenant'],
      where: { id },
    });
  }

  // 指定テナントID内の指定のユーザ名を取得
  async findOneByNameAndTenatnId(
    userName: string,
    tenantId: number,
  ): Promise<Users> {
    return await this.userRepository.findOne({
      relations: ['team', 'tenant'],
      where: { name: userName, tenant: { id: tenantId } },
    });
  }

  //  指定テナント名内の指定ユーザ名を取得
  async findOneByNameAndTenatnName(userName: string, tenantName: string) {
    console.log(userName);
    if (!userName) {
      throw new NotFoundException('userNotFound');
    }
    return await this.userRepository.findOne({
      relations: ['tenant'],
      where: { name: userName, tenant: { name: tenantName } },
    });
  }

  async create(
    tenantId: number,
    createUser: CreateUserRequest,
  ): Promise<Users> {
    const { team_id, name, password } = createUser;
    console.log(tenantId);
    // 関連エンティティの取得
    const tenant = await this.tenantService.findOneById(tenantId);
    const team = await this.teamService.findOneById(team_id);

    return await this.userRepository.save({
      tenant,
      team,
      name,
      password: await bcrypt.hash(password, 12),
      point: 0,
    });
  }

  async update(user: UpdateUserRequest): Promise<Users> {
    const { name, team_id, add_point } = user;
    const updateUser = await this.findOneById(user.id);

    // チームの変更先を取得
    let team;
    if (team_id) {
      team = await this.teamService.findOneById(team_id);
    }

    updateUser.team = team ?? updateUser.team;
    updateUser.name = name ?? updateUser.name;
    updateUser.point = updateUser.point + (add_point ?? 0);
    this.userRepository.save(updateUser);

    return updateUser;
  }
}
