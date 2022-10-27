import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Tenants } from 'src/entity/tenant.entity';
import { TeamService } from '../team/team.service';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import {
  authResponse,
  SignUptRequest,
  TenantLoginRequest,
  tokenPayload,
  UserLoginRequest,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(Users) private userRepository: Repository<Users>,
    private readonly teamService: TeamService,
    private readonly userService: UserService,
    private readonly tenantService: TenantService,
    private readonly jwtService: JwtService,
  ) {}

  async tenantLogin(
    tenantLoginParam: TenantLoginRequest,
  ): Promise<authResponse> {
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
      tenant: tenant.name,
      user_id: 0,
      user: '',
    };

    return {
      tenant: tenant.name,
      tenant_id: tenant.id,
      access_token: this.jwtService.sign(payload),
    };
  }

  async userLogin(userLoginParam: UserLoginRequest): Promise<authResponse> {
    const { user_name, tenant_name, password } = userLoginParam;
    const user = await this.userService.findLoginUser(user_name, tenant_name);
    const isValid = await bcrypt.compare(password, user.password);
    console.log('userlogin');
    console.log(isValid);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: tokenPayload = {
      tenant_id: user.tenant.id,
      tenant: user.tenant.name,
      user_id: user.id,
      user: user.name,
    };
    return {
      tenant_id: user.tenant.id,
      tenant: user.tenant.name,
      user_id: user.id,
      user: user.name,
      access_token: this.jwtService.sign(payload),
    };
  }

  // テナント作成
  async signup(tenant: SignUptRequest): Promise<authResponse> {
    console.log(tenant);

    const isExist: Tenants = await this.tenantService.validate(tenant.name);

    if (isExist) {
      throw new BadRequestException(`${tenant.name} is already exist`);
    }

    console.log('ExistOK');

    const createdTenant = await this.tenantService.create(tenant);

    const response = await this.tenantLogin({
      tenant_name: tenant.name,
      password: tenant.password,
    });

    // デフォルトチームを作成
    this.teamService.create({
      tenant_id: createdTenant.id,
      name: 'DefaultTeam',
    });

    return response;
  }
}
