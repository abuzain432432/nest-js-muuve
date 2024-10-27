import { Reflector } from "@nestjs/core";

/**
 * This decorator is used to bypass the user active  check for a handler
 **/
export const BypassUserActiveCheck = Reflector.createDecorator<boolean>();
