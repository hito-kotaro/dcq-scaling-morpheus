import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserLoginRequest, validateTokenResponse } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  @ApiResponse({ status: HttpStatus.OK, type: validateTokenResponse })
  @UseGuards(AuthGuard('jwt'))
  async loginCheck(@Request() req: any) {
    return { auth: true, admin: req.user.admin };
  }

  @Post('/user')
  @ApiResponse({ status: HttpStatus.OK, type: UserLoginRequest })
  async userLogin(@Body() userLoginParams: UserLoginRequest) {
    return this.authService.userLogin(userLoginParams);
  }

  @Post('/admin')
  @ApiResponse({ status: HttpStatus.OK, type: UserLoginRequest })
  async adminLogin(@Body() userLoginParams: UserLoginRequest) {
    return this.authService.adminLogin(userLoginParams);
  }
}
