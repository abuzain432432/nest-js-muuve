import { HttpException, HttpStatus } from '@nestjs/common';

export class IncompleteProfileException extends HttpException {
  constructor() {
    super(
      'Profile incomplete. Please complete your profile.',
      HttpStatus.PRECONDITION_REQUIRED,
    );
  }
}
