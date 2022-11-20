import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
    const { user_name, password } = userLoginParam;
    console.log(userLoginParam);
    console.log(user_name);
    const user = await this.userService.findOneByName(user_name);
    console.log(user);
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: tokenPayload = {
      user_id: user.id,
      user: user.name,
    };

    return {
      user_id: user.id,
      user: user.name,
      access_token: this.jwtService.sign(payload),
    };
  }
}
