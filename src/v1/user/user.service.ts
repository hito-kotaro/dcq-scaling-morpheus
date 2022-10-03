import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}
  findAll(): Promise<Users[]> {
    return this.userRepository.find();
  }

  async create(user: CreateUserDto): Promise<Users> {
    return await this.userRepository.save({
      username: user.username,
      password: user.password,
    });
  }
}
