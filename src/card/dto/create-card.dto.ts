import { IsNotEmpty, IsString, IsInt, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({
    example: 'CARD-001-2024',
    description: 'Unique card code'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  code: string;

  @ApiProperty({
    example: 1,
    description: 'User ID that owns this card'
  })
  @IsInt()
  @IsNotEmpty()
  user_id: number;
}
