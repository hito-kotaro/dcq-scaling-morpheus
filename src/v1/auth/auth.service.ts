import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginParamDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(Users) private userRepository: Repository<Users>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async userLogin(loginParam: LoginParamDto) {
    const user = await this.userService.findLoginUser(
      loginParam.user_name,
      loginParam.tenant_name,
    );
    const isValid = await bcrypt.compare(loginParam.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      nameId: user.id,
      userName: user.user_name,
      tenantId: user.tenant.id,
      tenantName: user.tenant.tenant_name,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
