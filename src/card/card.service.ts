import { Injectable, Logger } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { User } from '../user/entities/user.entity';
import {
  CardNotFoundException,
  CardCodeAlreadyExistsException,
  UserAlreadyHasCardException,
  UserNotFoundException
} from '../common/exceptions';

@Injectable()
export class CardService {
  private readonly logger = new Logger(CardService.name);

  constructor(
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async create(createCardDto: CreateCardDto) {
    try {
      // Check if card code already exists
      const existingCard = await this.cardRepository.findOne({
        where: { code: createCardDto.code },
      });
      if (existingCard) {
        throw new CardCodeAlreadyExistsException(createCardDto.code);
      }

      // Check if user exists
      const user = await this.userRepository.findOne({
        where: { id: createCardDto.user_id },
      });
      if (!user) {
        throw new UserNotFoundException(createCardDto.user_id);
      }

      // Check if user already has a card (one-to-one relationship)
      const existingUserCard = await this.cardRepository.findOne({
        where: { user_id: createCardDto.user_id },
      });
      if (existingUserCard) {
        throw new UserAlreadyHasCardException(createCardDto.user_id);
      }

      const card = this.cardRepository.create(createCardDto);
      const savedCard = await this.cardRepository.save(card);
      this.logger.log(`Card created successfully: ${savedCard.code}`);

      return await this.findOne(savedCard.id);
    } catch (error) {
      this.logger.error(`Error creating card: ${error.message}`);
      throw error;
    }
  }

  async findAll() {
    try {
      const cards = await this.cardRepository.find({
        relations: ['user'],
        select: {
          user: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          }
        }
      });
      this.logger.log(`Retrieved ${cards.length} cards`);
      return cards;
    } catch (error) {
      this.logger.error(`Error fetching cards: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const card = await this.cardRepository.findOne({
        where: { id },
        relations: ['user'],
        select: {
          user: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          }
        }
      });
      if (!card) {
        throw new CardNotFoundException(id);
      }
      return card;
    } catch (error) {
      this.logger.error(`Error finding card ${id}: ${error.message}`);
      throw error;
    }
  }

  async findByUserId(userId: number) {
    try {
      const card = await this.cardRepository.findOne({
        where: { user_id: userId },
        relations: ['user'],
        select: {
          user: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          }
        }
      });
      return card;
    } catch (error) {
      this.logger.error(`Error finding card for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, updateCardDto: UpdateCardDto) {
    try {
      const card = await this.cardRepository.findOne({ where: { id } });
      if (!card) {
        throw new CardNotFoundException(id);
      }

      // Check if code is being updated and if it already exists
      if (updateCardDto.code && updateCardDto.code !== card.code) {
        const existingCard = await this.cardRepository.findOne({
          where: { code: updateCardDto.code },
        });
        if (existingCard) {
          throw new CardCodeAlreadyExistsException(updateCardDto.code);
        }
      }

      // Check if user_id is being updated
      if (updateCardDto.user_id && updateCardDto.user_id !== card.user_id) {
        // Check if new user exists
        const newUser = await this.userRepository.findOne({
          where: { id: updateCardDto.user_id },
        });
        if (!newUser) {
          throw new UserNotFoundException(updateCardDto.user_id);
        }

        // Check if new user already has a card
        const existingUserCard = await this.cardRepository.findOne({
          where: { user_id: updateCardDto.user_id },
        });
        if (existingUserCard) {
          throw new UserAlreadyHasCardException(updateCardDto.user_id);
        }
      }

      const updatedCard = Object.assign(card, updateCardDto);
      const savedCard = await this.cardRepository.save(updatedCard);
      this.logger.log(`Card ${id} updated successfully`);

      return await this.findOne(savedCard.id);
    } catch (error) {
      this.logger.error(`Error updating card ${id}: ${error.message}`);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const card = await this.cardRepository.findOne({ where: { id } });
      if (!card) {
        throw new CardNotFoundException(id);
      }

      await this.cardRepository.remove(card);
      this.logger.log(`Card ${id} deleted successfully`);
      return { message: 'Card deleted successfully', id };
    } catch (error) {
      this.logger.error(`Error deleting card ${id}: ${error.message}`);
      throw error;
    }
  }
}
