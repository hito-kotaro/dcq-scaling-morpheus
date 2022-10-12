import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginParamDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: LoginParamDto })
  async login(@Body() loginParams: LoginParamDto) {
    return this.authService.login(loginParams);
  }
}
