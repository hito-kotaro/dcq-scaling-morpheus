import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  authResponse,
  SignUptRequest,
  TenantLoginRequest,
  UserLoginRequest,
} from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiResponse({ status: HttpStatus.OK, type: authResponse })
  async signup(@Body() signupParams: SignUptRequest) {
    return this.authService.signup(signupParams);
  }

  @Post('/tenant/login')
  @ApiResponse({ status: HttpStatus.OK, type: TenantLoginRequest })
  async tenantLogin(@Body() tenantLoginParams: TenantLoginRequest) {
    return this.authService.tenantLogin(tenantLoginParams);
  }

  @Post('/user/login')
  @ApiResponse({ status: HttpStatus.OK, type: UserLoginRequest })
  async login(@Body() userLoginParams: UserLoginRequest) {
    return this.authService.userLogin(userLoginParams);
  }
}
