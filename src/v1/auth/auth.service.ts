import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import { TenantLoginParamDto, UserLoginParamDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(Users) private userRepository: Repository<Users>,
    private readonly userService: UserService,
    private readonly tenantService: TenantService,
    private readonly jwtService: JwtService,
  ) {}

  async tenantLogin(tenantLoginParam: TenantLoginParamDto) {
    const { tenant_name, password } = tenantLoginParam;
    const tenant = await this.tenantService.findLoginTenant(tenant_name);

    const isValid = await bcrypt.compare(password, tenant.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      tenantId: tenant.id,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async userLogin(userLoginParam: UserLoginParamDto) {
    const { user_name, tenant_name, password } = userLoginParam;
    const user = await this.userService.findLoginUser(user_name, tenant_name);
    const isValid = await bcrypt.compare(password, user.password);
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
