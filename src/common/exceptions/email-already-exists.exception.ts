import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyExistsException extends BadRequestException {
  constructor(email: string) {
    super(`Email ${email} is already registered`);
  }
}
