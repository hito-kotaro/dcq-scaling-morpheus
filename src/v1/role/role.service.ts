import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/entity/role.entity';
import { Repository } from 'typeorm';
import { GetAllRolesResponse, GetOneRoleResponse } from './dto/role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Roles) private roleRepository: Repository<Roles>,
  ) {}

  async findOne(id: number): Promise<GetOneRoleResponse> {
    return await this.roleRepository.findOne({ where: { id } });
  }

  // roleを全て取得するメソッド
  async findAll(): Promise<GetAllRolesResponse> {
    const roles = await this.roleRepository.find();
    return { roles };
  }
}
