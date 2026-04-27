import { BadRequestException } from '@nestjs/common';

export class CardCodeAlreadyExistsException extends BadRequestException {
  constructor(code: string) {
    super(`Card code ${code} is already registered`);
  }
}
