import { applyDecorators } from "@nestjs/common";

import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, MinLength } from "class-validator";

interface StringDecoratorOptionsType {
  minLength?: number;
  isStringMessage?: string;
  isNotEmptyMessage?: string;
  minLengthMessage?: string;
}

export function String(options: StringDecoratorOptionsType = {}) {
  const {
    minLength = 0,
    isStringMessage = "This field must be a string",
    isNotEmptyMessage = "This field is required",
    minLengthMessage = `This field must be at least ${minLength} characters long`,
  } = options;

  return applyDecorators(
    MinLength(minLength, { message: minLengthMessage }),
    IsString({ message: isStringMessage }),
    IsNotEmpty({ message: isNotEmptyMessage }),
    Transform(({ value }) => value?.trim()),
  );
}
