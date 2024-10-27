import { Reflector } from '@nestjs/core';

/**
 * This decorator is used to bypass the profile check for a handler
 * in the case of a user with an incomplete profile trying to access a protected route
 **/
export const BypassProfileCompleteCheck = Reflector.createDecorator<boolean>();
