import {
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
import {
  CreateUserRequest,
  FindOneUserResponse,
  UpdateUserRequest,
  UserSuccessResponse,
} from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: FindOneUserResponse })
  async findAllByTenantId(@Param('tenantId') id: number, @Request() req: any) {
    console.log(req.user.tenant_id);
    return await this.userService.findAllByTenantId(req.user.tenant_id);
  }

  @Get(':userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: FindOneUserResponse })
  async findOne(@Param('userId') id: number, @Request() req: any) {
    console.log(req.user);
    return await this.userService.findOneById(id);
  }

  @Get('/member/:teamId')
  // @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: FindOneUserResponse })
  async findMember(@Param('teamId') id: number, @Request() req: any) {
    return await this.userService.findMemberByTeamId(id);
  }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: UserSuccessResponse })
  async create(@Body() CreateUser: CreateUserRequest) {
    return this.userService.create(CreateUser);
  }

  @Put(':userId')
  @ApiResponse({ status: HttpStatus.OK, type: UserSuccessResponse })
  async update(
    @Param('userId') id: number,
    @Body(ValidationPipe) updateUser: UpdateUserRequest,
  ) {
    return this.userService.update(id, updateUser);
  }
}
