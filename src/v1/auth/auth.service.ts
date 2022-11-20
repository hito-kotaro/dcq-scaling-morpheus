import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { authResponse, tokenPayload, UserLoginRequest } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(Users) private userRepository: Repository<Users>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async userLogin(userLoginParam: UserLoginRequest): Promise<authResponse> {
    const { name, password } = userLoginParam;
    const user = await this.userService.findOneByName(name);
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      Logger.warn(`user_id ${user.id} login failed`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: tokenPayload = {
      id: user.id,
      name: user.name,
    };

    Logger.log(`user_id ${user.id} login success`);

    return {
      id: user.id,
      name: user.name,
      token: this.jwtService.sign(payload),
    };
  }

  async adminLogin(userLoginParam: UserLoginRequest): Promise<authResponse> {
    console.log('admin');
    const { name, password } = userLoginParam;
    const user = await this.userService.findOneByName(name);
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.admin !== true) {
      Logger.warn(`user_id ${user.id} login failed`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: tokenPayload = {
      id: user.id,
      name: user.name,
    };

    Logger.log(`user_id ${user.id} login success`);

    return {
      id: user.id,
      name: user.name,
      token: this.jwtService.sign(payload),
    };
  }
}
