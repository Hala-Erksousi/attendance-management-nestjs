import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
     secretOrKey: configService.get<string>('JWT_SECRET') || '',
    });
  }

  // هذه الدالة تنفذ "تلقائياً" بعد التأكد من صحة التوكن تقنياً
  async validate(req: any, payload: any) {
  const authHeader = req.headers?.authorization; // استخدام ? لتجنب الانهيار
  if (!authHeader) {
    throw new UnauthorizedException('No authorization header found');
  }

    const token = req.headers.authorization.split(' ')[1];

    // الفحص
    const isBlacklisted = await this.authService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token is no longer valid. Please login again.');
    }

    return { userId: payload.sub, email: payload.email, role: payload.roleName };
  }
}