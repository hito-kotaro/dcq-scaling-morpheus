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
    const tenant = await this.tenantService.findOneByName(tenant_name);
    const isValid = await bcrypt.compare(password, tenant.password);
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
    console.log(userLoginParam);
    console.log(user_name);
    const user = await this.userService.findOneByNameAndTenatnName(
      user_name,
      tenant_name,
    );
    console.log(user);
    const isValid = await bcrypt.compare(password, user.password);
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
    // 同名テナントが既に存在していたらエラー
    if (await this.tenantService.findOneByName(tenant.name)) {
      throw new BadRequestException('already exist');
    }

    const createdTenant = await this.tenantService.create(tenant);

    // 初回はそのままログイン
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
