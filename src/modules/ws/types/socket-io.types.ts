import { Socket } from 'socket.io';
import { IUser } from 'src/common/types/user.type';

export interface AuthenticatedSocket extends Socket {
  user: IUser;
}
