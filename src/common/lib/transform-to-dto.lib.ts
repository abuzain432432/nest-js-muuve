import { plainToInstance, ClassTransformOptions } from 'class-transformer';
import { InternalServerErrorException } from '@nestjs/common';
import { validateSync } from 'class-validator';
// Inspired by
// https://medium.com/@rakibulh170/a-response-serializer-for-strictly-typed-response-in-nestjs-402e5667ff0a#:~:text=In%20NestJs%2C%20there%20is%20a,any%20things%20that%20we%20want.

/**
 * Transforms a plain object into an instance of a given DTO class with optional configuration.
 * Validates the transformed instance and throws an error if validation fails.
 * @param dtoClass - The DTO class to transform into.
 * @param plainObject - The plain object to transform.
 * @param options - Optional configuration to override default settings.
 * @returns An instance of the DTO class.
 */
export function transformToDto<T extends object>(
  dtoClass: new () => T,
  plainObject: object,
  options?: Partial<ClassTransformOptions>,
): T {
  const defaultOptions: ClassTransformOptions = {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  };

  const finalOptions = { ...defaultOptions, ...options };

  const dtoInstance = plainToInstance(dtoClass, plainObject, finalOptions);
  const errors = validateSync(dtoInstance);

  if (errors.length > 0) {
    console.log(errors);
    // TODO: Log the errors
    throw new InternalServerErrorException('Something went wrong');
  }

  return dtoInstance;
}
