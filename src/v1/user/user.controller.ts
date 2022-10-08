import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindOneUserResponse } from './dto/user.dto';
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
}
