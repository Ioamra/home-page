import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserInfoInJwt } from 'src/common/models/request.model';
import { config } from '../../config/config';
import { UserAccount } from '../user-account/entities/user-account.entity';
import { UserAccountService } from '../user-account/user-account.service';
import { RegisterDto } from './dto/register.dto';

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

  public async register(RegisterDto: RegisterDto, photo?: MemoryStorageFile): Promise<{ id: number }> {
    const hashedPassword = await bcrypt.hash(RegisterDto.password, await bcrypt.genSalt());
    const user_account = await this.userAccountService.create(
      {
        email: RegisterDto.email,
        password: hashedPassword,
      },
      photo,
    );
    return { id: user_account.id };
  }
}
