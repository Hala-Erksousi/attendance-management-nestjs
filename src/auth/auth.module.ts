import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistedToken } from './entities/blacklisted-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlacklistedToken]),
    // 1. التأكد من استيراد ConfigModule ليتعامل مع الـ .env
    ConfigModule, 
    UserModule,
    
    // 2. إعداد JWT بشكل Async
    JwtModule.registerAsync({
      imports: [ConfigModule], // يحتاج لـ ConfigModule
      inject: [ConfigService], // حقن الخدمة للوصول للمتغيرات
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [JwtModule,JwtAuthGuard,AuthService,JwtStrategy]
})
export class AuthModule {}