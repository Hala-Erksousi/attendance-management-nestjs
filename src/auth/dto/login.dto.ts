import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'ahmad@example.com', 
    description: 'Email address of the user',
    format: 'email'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: 'Password123!', 
    description: 'User password (min 8 chars, must contain uppercase, lowercase, number)',
    minLength: 8
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}