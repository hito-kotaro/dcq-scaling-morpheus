import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserLoginRequest } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/user/login')
  @ApiResponse({ status: HttpStatus.OK, type: UserLoginRequest })
  async userLogin(@Body() userLoginParams: UserLoginRequest) {
    return this.authService.userLogin(userLoginParams);
  }
}
