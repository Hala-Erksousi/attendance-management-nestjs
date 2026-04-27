import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, MinLength, MaxLength } from 'class-validator';

export class UpdateCardDto extends PartialType(CreateCardDto) {
  @ApiPropertyOptional({
    example: 'CARD-001-2024-UPDATED',
    description: 'Unique card code'
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  code?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'User ID that owns this card'
  })
  @IsOptional()
  @IsInt()
  user_id?: number;
}
