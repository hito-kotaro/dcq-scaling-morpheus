import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TenantLoginParamDto, UserLoginParamDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/tenant/login')
  @ApiResponse({ status: HttpStatus.OK, type: TenantLoginParamDto })
  async tenantLogin(@Body() tenantLoginParams: TenantLoginParamDto) {
    return this.authService.tenantLogin(tenantLoginParams);
  }

  @Post('/user/login')
  @ApiResponse({ status: HttpStatus.OK, type: UserLoginParamDto })
  async login(@Body() userLoginParams: UserLoginParamDto) {
    return this.authService.userLogin(userLoginParams);
  }
}
