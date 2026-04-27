import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { BlacklistedToken } from './entities/blacklisted-token.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
    constructor(
    @InjectRepository(BlacklistedToken) private blacklistRepository: Repository<BlacklistedToken>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

    async login(loginDto: LoginDto) {
  const user = await this.userService.findByEmail(loginDto.email);
  if (!user) throw new UnauthorizedException();
  // هنا قارن كلمة المرور المشفرة باستخدام bcrypt
  console.log('Password from DTO:', loginDto.password);
console.log('Hash from DB:', user?.password);
  const isMatch = await bcrypt.compare(loginDto.password, user.password);
  
  if (!isMatch) throw new UnauthorizedException();

  const payload = { sub: user.id, email: user.email };
  return {
    access_token: await this.jwtService.signAsync(payload),
  };
}

async logout(token: string) {
  await this.blacklistRepository.save({ token });
  return { message: 'Logged out successfully' };
}
async isTokenBlacklisted(token: string): Promise<boolean> {
  const result = await this.blacklistRepository.findOne({ where: { token } });
  return !!result; // يرجع true إذا وجده، و false إذا لم يجده
}

}
