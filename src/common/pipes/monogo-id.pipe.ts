import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

// TODO implement the global exception filter to make sure that errors are always packed in an array to stay consist with the rest of the application
@Injectable()
export class IsMongoIdPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Invalid Id');
    }
    return value;
  }
}
