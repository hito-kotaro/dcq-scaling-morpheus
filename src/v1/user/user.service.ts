import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from './dto/user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  fmtResponse(user: Users): UserResponse {
    const response: UserResponse = {
      id: user.id,
      name: user.name,
      admin: user.admin,
      point: user.point,
    };

    return response;
  }

  // ユーザ取得
  async findAll(): Promise<Users[]> {
    return await this.userRepository.find();
  }

  // 指定Idのユーザ取得
  async findOneById(id: number): Promise<Users> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  // 指定名のユーザ取得
  async findOneByName(name: string): Promise<Users> {
    return await this.userRepository.findOne({ where: { name } });
  }

  async create(createUser: CreateUserRequest): Promise<Users> {
    const { name, password, admin } = createUser;
    return await this.userRepository.save({
      name,
      password: await bcrypt.hash(password, 12),
      admin,
      point: 0,
    });
  }

  async update(id: number, user: UpdateUserRequest): Promise<Users> {
    const { name, password, add_point } = user;
    const updateUser = await this.findOneById(id);

    updateUser.name = name ?? updateUser.name;
    updateUser.password =
      (await bcrypt.hash(password, 12)) ?? updateUser.password;
    updateUser.point = updateUser.point + (add_point ?? 0);
    this.userRepository.save(updateUser);

    return updateUser;
  }
}
