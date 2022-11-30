import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Users } from 'src/entity/user.entity';
import {
  UpdateUserRequest,
  UserResponse,
  AllUserResponse,
  CreateUserRequest,
} from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: AllUserResponse })
  async findAll() {
    const users = await this.userService.findAll();
    const fmtUsers: UserResponse[] = users.map((u: Users) => {
      return this.userService.fmtResponse(u);
    });

    return { users: fmtUsers, total: fmtUsers.length };
  }

  // @Get(':userId')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  // async findOne(@Param('userId') id: number, @Request() req: any) {
  //   const user = await this.userService.findOneById(id);
  //   return this.userService.fmtResponse(user);
  // }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  async create(@Body() CreateUser: CreateUserRequest) {
    // 重複チェック
    if (await this.userService.findOneByName(CreateUser.name)) {
      throw new BadRequestException('already exist');
    }

    const user = await this.userService.create(CreateUser);
    return this.userService.fmtResponse(user);
  }

  @Put(':userId')
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  async update(
    @Param('userId') id,
    @Body(ValidationPipe) updateUser: UpdateUserRequest,
  ) {
    const user = await this.userService.update(id, updateUser);
    return this.userService.fmtResponse(user);
  }
}
