import { NotFoundException } from '@nestjs/common';

export class CardNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Card with ID ${id} not found`);
  }
}
