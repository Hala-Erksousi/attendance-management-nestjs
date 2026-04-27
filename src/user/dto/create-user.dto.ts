import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Ahmad', description: 'First name of the user' })
  @IsString({ message: 'الاسم الأول يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'الاسم الأول مطلوب' })
  @MinLength(2, { message: 'الاسم الأول يجب أن يكون على الأقل حرفين' })
  @MaxLength(50, { message: 'الاسم الأول يجب ألا يزيد عن 50 حرفاً' })
  first_name: string;

  @ApiProperty({ example: 'Ali', description: 'Last name of the user' })
  @IsString({ message: 'الاسم الأخير يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'الاسم الأخير مطلوب' })
  @MinLength(2, { message: 'الاسم الأخير يجب أن يكون على الأقل حرفين' })
  @MaxLength(50, { message: 'الاسم الأخير يجب ألا يزيد عن 50 حرفاً' })
  last_name: string;

  @ApiProperty({ example: 'ahmad@example.com', description: 'Email address' })
  @IsEmail({}, { message: 'الإيميل غير صحيح' })
  @IsNotEmpty({ message: 'الإيميل مطلوب' })
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Password (min 8 chars, must contain uppercase, lowercase, number)' })
  @IsString({ message: 'كلمة المرور يجب أن تكون نصاً' })
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    { message: 'كلمة المرور يجب أن تحتوي على أحرف صغيرة وكبيرة وأرقام' }
  )
  password: string;

  @ApiProperty({ example: 'male', enum: ['male', 'female'], description: 'Gender' })
  @IsEnum(['male', 'female'], { message: 'الجنس يجب أن يكون (ذكر) أو (أنثى)' })
  @IsNotEmpty({ message: 'الجنس مطلوب' })
  gender: string;

  @ApiProperty({ example: '0933xxxxxx', description: 'Phone number', required: false })
  @IsString({ message: 'رقم الهاتف يجب أن يكون نصاً' })
  @IsOptional()
  @Matches(/^[0-9+\-\s()]{9,}$/, { message: 'رقم الهاتف غير صحيح' })
  phone: string;

  @ApiProperty({ example: '2023', description: 'University year' })
  @IsString({ message: 'السنة يجب أن تكون نصاً' })
  @IsNotEmpty({ message: 'السنة مطلوبة' })
  @IsEnum(['1', '2', '3', '4'], { message: 'السنة يجب أن تكون من 1 إلى 4' })
  year: string;

  @ApiProperty({ example: 'Software Engineering', description: 'Specialization' })
  @IsString({ message: 'التخصص يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'التخصص مطلوب' })
  @MinLength(2, { message: 'التخصص يجب أن يكون على الأقل حرفين' })
  specialization: string;

  @ApiProperty({ example: 'user', enum: ['user', 'admin', 'supervisor'], description: 'User role' })
  @IsEnum(['user', 'admin', 'supervisor'], { message: 'الدور يجب أن يكون (user أو admin أو supervisor)' })
  @IsNotEmpty({ message: 'الدور مطلوب' })
  role: string;
}