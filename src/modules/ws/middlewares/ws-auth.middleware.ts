import { Socket } from "socket.io";
import { AuthService } from "src/modules/auth/auth.service";

type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;
export const AuthWsMiddleware = (
  authService: AuthService,
): SocketMiddleware => {
  return async (socket: Socket, next) => {
    const authHeader = socket.request.headers["authorization"];
    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      console.error("No token found in request");
      return next(new Error("Unauthorized"));
    }

    const user = await authService.validateTokenAndGetUser(token);
    if (!user) {
      console.error("User not found or token invalid");
      return next(new Error("Unauthorized"));
    }
    socket["user"] = user;
    next();
  };
};
