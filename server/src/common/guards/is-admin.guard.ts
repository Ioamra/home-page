import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { config } from '../../config/config';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const isAdmin = this.reflector.get<boolean>('isAdmin', context.getHandler());
    if (!isAdmin) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.cookies.Authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    let user;
    try {
      user = this.jwtService.verify(token, {
        secret: config().jwt.private,
      });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    if (!user.is_admin) {
      throw new UnauthorizedException('User is not an admin');
    }

    request.user = user;
    return true;
  }
}
