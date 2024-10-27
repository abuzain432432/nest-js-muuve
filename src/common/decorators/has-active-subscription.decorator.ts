import { Reflector } from "@nestjs/core";

/**
 **/
export const HasActiveSubscription = Reflector.createDecorator<boolean>();
