import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus,UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth ,ApiOperation, ApiResponse, ApiParam, ApiBadRequestResponse, ApiNotFoundResponse, ApiConflictResponse } from '@nestjs/swagger';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Card } from './entities/card.entity';


@ApiTags('Cards')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new card' })
  @ApiResponse({
    status: 201,
    description: 'Card created successfully',
    type: Card
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiConflictResponse({ description: 'Card code already exists or user already has a card' })
  async create(@Body() createCardDto: CreateCardDto) {
    return await this.cardService.create(createCardDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all cards' })
  @ApiResponse({
    status: 200,
    description: 'List of all cards with user information',
    type: [Card]
  })
  async findAll() {
    return await this.cardService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a card by ID' })
  @ApiResponse({
    status: 200,
    description: 'Card found with user information',
    type: Card
  })
  @ApiNotFoundResponse({ description: 'Card not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'Card ID' })
  async findOne(@Param('id') id: string) {
    return await this.cardService.findOne(+id);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get card by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Card found for the user',
    type: Card
  })
  @ApiNotFoundResponse({ description: 'Card not found for this user' })
  @ApiParam({ name: 'userId', type: 'number', description: 'User ID' })
  async findByUserId(@Param('userId') userId: string) {
    return await this.cardService.findByUserId(+userId);
  }


  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a card by ID' })
  @ApiResponse({
    status: 200,
    description: 'Card updated successfully',
    type: Card
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Card not found' })
  @ApiConflictResponse({ description: 'Card code already exists or user already has a card' })
  @ApiParam({ name: 'id', type: 'number', description: 'Card ID' })
  async update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return await this.cardService.update(+id, updateCardDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a card by ID' })
  @ApiResponse({
    status: 200,
    description: 'Card deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Card deleted successfully' },
        id: { type: 'number', example: 1 }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Card not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'Card ID' })
  async remove(@Param('id') id: string) {
    return await this.cardService.remove(+id);
  }
}
