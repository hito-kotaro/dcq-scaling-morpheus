import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
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
  async findAllByTenantId(@Param('tenantId') id: number, @Request() req: any) {
    const users = await this.userService.findAllByTenantId(req.user.tenant_id);
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

  @Get('/member/:teamId')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: AllUserResponse })
  async findMember(@Param('teamId') id: number) {
    const users: Users[] = await this.userService.findAllByTeamId(id);
    const fmtUsers: UserResponse[] = users.map((u: Users) => {
      return this.userService.fmtResponse(u);
    });

    return { users: fmtUsers, total: fmtUsers.length };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  async create(@Body() CreateUser: CreateUserRequest, @Request() req: any) {
    // 重複チェック
    console.log(req.user);
    if (
      await this.userService.findOneByNameAndTenatnId(
        CreateUser.name,
        req.user.tenant_id,
      )
    ) {
      throw new BadRequestException('already exist');
    }

    const user = await this.userService.create(req.user.tenant_id, CreateUser);
    return this.userService.fmtResponse(user);
  }

  @Put()
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  async update(@Body(ValidationPipe) updateUser: UpdateUserRequest) {
    const user = await this.userService.update(updateUser);
    return this.userService.fmtResponse(user);
  }
}
