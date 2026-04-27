import { Controller, Post, UseGuards, Body, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiTags,ApiBearerAuth, ApiOperation, ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User login',    
    description: 'Authenticate user with email and password, returns JWT token' 
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: { 
          type: 'string', 
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 
        }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid email or password' 
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // src/auth/auth.controller.ts
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Post('logout')
@ApiOperation({ summary: 'Logout and invalidate the current token' })
async logout(@Req() req: any) {
  const token = req.headers.authorization.split(' ')[1];
  return await this.authService.logout(token);
}
}
