import { BadRequestException } from '@nestjs/common';

export class UserAlreadyHasCardException extends BadRequestException {
  constructor(userId: number) {
    super(`User with ID ${userId} already has a card`);
  }
}
