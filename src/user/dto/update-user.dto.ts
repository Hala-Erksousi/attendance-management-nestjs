import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength, Matches, IsEnum, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    example: 'Ahmad',
    description: 'First name of the user'
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  first_name?: string;

  @ApiPropertyOptional({
    example: 'Ali',
    description: 'Last name of the user'
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  last_name?: string;

  @ApiPropertyOptional({
    example: 'ahmad.updated@example.com',
    description: 'Email address'
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'NewPassword123!',
    description: 'Password (must contain uppercase, lowercase, number)'
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/)
  password?: string;

  @ApiPropertyOptional({
    example: 'male',
    enum: ['male', 'female'],
    description: 'Gender'
  })
  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;

  @ApiPropertyOptional({
    example: '0933xxxxxx',
    description: 'Phone number'
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-\s()]{9,}$/)
  phone?: string;

  @ApiPropertyOptional({
    example: '2023',
    description: 'University year'
  })
  @IsOptional()
  @IsString()
  @IsEnum(['1', '2', '3', '4'])
  year?: string;

  @ApiPropertyOptional({
    example: 'Computer Science',
    description: 'Specialization'
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  specialization?: string;

  @ApiPropertyOptional({
    example: 'admin',
    enum: ['user', 'admin', 'supervisor'],
    description: 'User role'
  })
  @IsOptional()
  @IsEnum(['user', 'admin', 'supervisor'])
  role?: string;
}
