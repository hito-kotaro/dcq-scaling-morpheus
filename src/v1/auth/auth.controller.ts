import { Body, Controller, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserLoginRequest } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
