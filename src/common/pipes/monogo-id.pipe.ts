import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";

import { isValidObjectId } from "mongoose";

@Injectable()
export class IsMongoIdPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!isValidObjectId(value)) {
      throw new BadRequestException("Invalid Id");
    }
    return value;
  }
}
