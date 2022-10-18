import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import {
  TenantLoginRequest,
  tokenPayload,
  UserLoginRequest,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(Users) private userRepository: Repository<Users>,
    private readonly userService: UserService,
    private readonly tenantService: TenantService,
    private readonly jwtService: JwtService,
  ) {}

  async tenantLogin(tenantLoginParam: TenantLoginRequest) {
    const { tenant_name, password } = tenantLoginParam;
    const tenant = await this.tenantService.findOneByName(tenant_name, true);
    console.log(tenant);
    const isValid = await bcrypt.compare(password, tenant.password);
    console.log(isValid);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: tokenPayload = {
      tenant_id: tenant.id,
      tenant_name: tenant.name,
      user_id: 0,
      user_name: '',
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async userLogin(userLoginParam: UserLoginRequest) {
    const { user_name, tenant_name, password } = userLoginParam;
    const user = await this.userService.findLoginUser(user_name, tenant_name);
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: tokenPayload = {
      tenant_id: user.tenant.id,
      tenant_name: user.tenant.name,
      user_id: user.id,
      user_name: user.user_name,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
