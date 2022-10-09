import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  FindOneUserResponse,
  UserSuccessResponse,
} from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  @ApiResponse({ status: HttpStatus.OK, type: FindOneUserResponse })
  async findOne(@Param('userId') id: number) {
    return await this.userService.findOne(id);
  }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: UserSuccessResponse })
  async create(@Body() CreateUser: CreateUserDto) {
    return this.userService.create(CreateUser);
  }
}
