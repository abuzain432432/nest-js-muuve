import { Request } from 'express';

import { IUser } from './user.type';
/**
 * Authenticated request interface
 **/
export interface IRequest extends Request {
  user: IUser;
}
