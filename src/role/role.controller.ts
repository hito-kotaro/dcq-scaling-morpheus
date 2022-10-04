import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllRolesResponse } from './dto/role.dto';
import { RoleService } from './role.service';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: GetAllRolesResponse })
  async findAll() {
    return await this.roleService.findAll();
  }
}
