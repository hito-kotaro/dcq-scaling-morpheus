import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginParamDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginParam: LoginParamDto) {
    const payload = { name: loginParam.user_name };
    return { access_token: this.jwtService.sign(payload) };
  }
}
