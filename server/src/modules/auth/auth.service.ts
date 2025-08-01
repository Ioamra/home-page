import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserInfoInJwt } from 'src/common/models/request.model';
import { config } from '../../config/config';
import { UserAccount } from '../user_account/entities/user_account.entity';
import { UserAccountService } from '../user_account/user_account.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userAccountService: UserAccountService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(email: string, password: string): Promise<Partial<UserAccount>> {
    const user: UserAccount = await this.userAccountService.findForLogin(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const result = { ...user };
        delete result.password;
        return result;
      }
    }
    return null;
  }

  public async login(user: UserInfoInJwt): Promise<{ access_token: string }> {
    const payload: UserInfoInJwt = {
      id: user.id,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        algorithm: config().jwt.algorithm as 'RS256' | 'HS256' | 'HS384' | 'HS512' | 'RS256',
        expiresIn: config().jwt.expiresIn,
        privateKey: config().jwt.private,
      }),
    };
  }

  public async register(email: string, password: string): Promise<{ id: number }> {
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
    const user_account = await this.userAccountService.create({
      email,
      password: hashedPassword,
      photo: config().defaultPhoto,
    });
    return { id: user_account.id };
  }
}
