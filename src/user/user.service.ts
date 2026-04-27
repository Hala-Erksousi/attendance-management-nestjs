import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserNotFoundException, EmailAlreadyExistsException } from 'src/common/exceptions';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly SALT_ROUNDS = 10;

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Check if email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new EmailAlreadyExistsException(createUserDto.email);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(createUserDto.password, this.SALT_ROUNDS);

      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(user);
      const userEntity = Array.isArray(savedUser) ? savedUser[0] : savedUser;
      this.logger.log(`User created successfully: ${userEntity.email}`);

      // Return user without password
      return this.sanitizeUser(userEntity);
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find();
      this.logger.log(`Retrieved ${users.length} users`);
      return users.map((user) => this.sanitizeUser(user));
    } catch (error) {
      this.logger.error(`Error fetching users: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new UserNotFoundException(id);
      }
      return this.sanitizeUser(user);
    } catch (error) {
      this.logger.error(`Error finding user ${id}: ${error.message}`);
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new UserNotFoundException(id);
      }

      // Check if email is being updated and if it already exists
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });
        if (existingUser) {
          throw new EmailAlreadyExistsException(updateUserDto.email);
        }
      }

      // Hash password if it's being updated
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, this.SALT_ROUNDS);
      }

      const updatedUser = Object.assign(user, updateUserDto);
      const savedUser = await this.userRepository.save(updatedUser);
      this.logger.log(`User ${id} updated successfully`);

      return this.sanitizeUser(savedUser);
    } catch (error) {
      this.logger.error(`Error updating user ${id}: ${error.message}`);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new UserNotFoundException(id);
      }

      await this.userRepository.remove(user);
      this.logger.log(`User ${id} deleted successfully`);
      return { message: 'User deleted successfully', id };
    } catch (error) {
      this.logger.error(`Error deleting user ${id}: ${error.message}`);
      throw error;
    }
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      this.logger.error(`Error validating password: ${error.message}`);
      return false;
    }
  }

  public sanitizeUser(user: User): Partial<User> {
    // Create a copy without password field
    const result = { ...user } as any;
    delete result.password;
    return result;
  }
}
