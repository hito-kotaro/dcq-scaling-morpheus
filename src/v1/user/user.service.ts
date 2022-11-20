import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { TeamService } from '../team/team.service';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from './dto/user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
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

  // ユーザ取得
  async findAll(): Promise<Users[]> {
    return await this.userRepository.find({
      relations: ['team'],
    });
  }

  // 指定Idのユーザ取得
  async findOneById(id: number): Promise<Users> {
    return await this.userRepository.findOne({
      relations: ['team'],
      where: { id },
    });
  }

  // 指定名のユーザ取得
  async findOneByName(name: string): Promise<Users> {
    return await this.userRepository.findOne({
      relations: ['team'],
      where: { name },
    });
  }

  async create(createUser: CreateUserRequest): Promise<Users> {
    const { team_id, name, password } = createUser;
    // 関連エンティティの取得
    const team = await this.teamService.findOneById(team_id);

    return await this.userRepository.save({
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
